import json
import os
import requests
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_id_from_token(headers: dict) -> int:
    """Извлечение user_id из токена"""
    auth_header = headers.get('x-authorization', headers.get('X-Authorization', ''))
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '')
    return int(token.split(':')[0]) if ':' in token else None

def create_cryptocloud_invoice(amount: float, currency: str, user_id: int, api_key: str) -> dict:
    """Создание инвойса в CryptoCloud для генерации адреса"""
    url = 'https://api.cryptocloud.plus/v2/invoice/create'
    
    headers = {
        'Authorization': f'Token {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'amount': amount,
        'currency': currency,
        'order_id': f'deposit_{user_id}_{int(datetime.utcnow().timestamp())}',
        'add_fields': {
            'user_id': str(user_id)
        }
    }
    
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    response.raise_for_status()
    
    return response.json()

def get_or_create_deposit_address(user_id: int, currency: str, conn, api_key: str) -> dict:
    """Получить существующий или создать новый адрес для депозита"""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT address, tag, invoice_id, created_at
        FROM crypto_deposit_addresses
        WHERE user_id = %s AND currency = %s AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id, currency))
    
    existing = cur.fetchone()
    
    if existing:
        return {
            'address': existing['address'],
            'tag': existing['tag'],
            'currency': currency,
            'invoice_id': existing['invoice_id'],
            'created_at': existing['created_at'].isoformat() if existing['created_at'] else None
        }
    
    invoice = create_cryptocloud_invoice(0, currency, user_id, api_key)
    
    if invoice.get('status') == 'success':
        result = invoice.get('result', {})
        address = result.get('address')
        tag = result.get('tag')
        invoice_id = result.get('uuid')
        
        cur.execute("""
            INSERT INTO crypto_deposit_addresses (
                user_id, currency, address, tag, invoice_id, status
            ) VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (user_id, currency, address, tag, invoice_id, 'active'))
        
        conn.commit()
        
        return {
            'address': address,
            'tag': tag,
            'currency': currency,
            'invoice_id': invoice_id,
            'created_at': datetime.utcnow().isoformat()
        }
    
    raise Exception('Failed to create CryptoCloud invoice')

def handler(event: dict, context) -> dict:
    """API для работы с криптовалютными депозитами через CryptoCloud"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        user_id = get_user_id_from_token(event.get('headers', {}))
        if not user_id:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Unauthorized'}),
                'isBase64Encoded': False
            }
        
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        api_key = os.environ.get('CRYPTOCLOUD_API_KEY')
        
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'CryptoCloud API key not configured'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(db_url, options=f'-c search_path={schema}')
        conn.autocommit = False
        
        try:
            if method == 'GET':
                query_params = event.get('queryStringParameters', {}) or {}
                currency = query_params.get('currency', 'BTC')
                
                address_info = get_or_create_deposit_address(user_id, currency, conn, api_key)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'deposit': address_info}),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                data = json.loads(event.get('body', '{}'))
                action = data.get('action')
                
                if action == 'get_all_addresses':
                    supported_currencies = ['BTC', 'ETH', 'USDT', 'LTC', 'BCH']
                    addresses = {}
                    
                    for currency in supported_currencies:
                        try:
                            addr_info = get_or_create_deposit_address(user_id, currency, conn, api_key)
                            addresses[currency] = addr_info
                        except Exception as e:
                            addresses[currency] = {'error': str(e)}
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'success': True, 'addresses': addresses}),
                        'isBase64Encoded': False
                    }
                
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unknown action'}),
                        'isBase64Encoded': False
                    }
            
            else:
                return {
                    'statusCode': 405,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Method not allowed'}),
                    'isBase64Encoded': False
                }
        
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
