import json
import os
import hashlib
import hmac
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def verify_webhook_signature(payload: str, signature: str, secret: str) -> bool:
    """Проверка подписи вебхука от CryptoCloud"""
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

def process_payment(invoice_id: str, amount_crypto: float, currency: str, status: str, conn):
    """Обработка входящего платежа"""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute("""
        SELECT user_id, address
        FROM crypto_deposit_addresses
        WHERE invoice_id = %s
        LIMIT 1
    """, (invoice_id,))
    
    deposit_info = cur.fetchone()
    
    if not deposit_info:
        raise Exception(f'Invoice {invoice_id} not found')
    
    user_id = deposit_info['user_id']
    
    if status == 'success':
        cur.execute("""
            INSERT INTO crypto_transactions (
                user_id, invoice_id, currency, amount_crypto, 
                type, status, processed_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id, invoice_id, currency, amount_crypto,
            'deposit', 'completed', datetime.utcnow()
        ))
        
        transaction_id = cur.fetchone()['id']
        
        cur.execute("""
            SELECT amount FROM wallet_balances
            WHERE user_id = %s AND currency = %s
        """, (user_id, currency))
        
        balance = cur.fetchone()
        
        if balance:
            cur.execute("""
                UPDATE wallet_balances
                SET amount = amount + %s, updated_at = %s
                WHERE user_id = %s AND currency = %s
            """, (amount_crypto, datetime.utcnow(), user_id, currency))
        else:
            cur.execute("""
                INSERT INTO wallet_balances (user_id, currency, amount, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, currency, amount_crypto, datetime.utcnow(), datetime.utcnow()))
        
        conn.commit()
        
        return {
            'success': True,
            'transaction_id': transaction_id,
            'user_id': user_id,
            'amount': amount_crypto,
            'currency': currency
        }
    
    elif status == 'pending':
        cur.execute("""
            INSERT INTO crypto_transactions (
                user_id, invoice_id, currency, amount_crypto,
                type, status
            ) VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (invoice_id) DO UPDATE
            SET status = 'pending'
        """, (user_id, invoice_id, currency, amount_crypto, 'deposit', 'pending'))
        
        conn.commit()
        
        return {
            'success': True,
            'status': 'pending',
            'message': 'Transaction is pending confirmation'
        }
    
    else:
        return {
            'success': False,
            'status': status,
            'message': f'Unknown status: {status}'
        }

def handler(event: dict, context) -> dict:
    """Вебхук для обработки уведомлений от CryptoCloud о входящих платежах"""
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Signature',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        webhook_secret = os.environ.get('CRYPTOCLOUD_WEBHOOK_SECRET')
        if not webhook_secret:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Webhook secret not configured'}),
                'isBase64Encoded': False
            }
        
        headers = event.get('headers', {})
        signature = headers.get('x-webhook-signature', headers.get('X-Webhook-Signature', ''))
        
        body = event.get('body', '{}')
        
        if not verify_webhook_signature(body, signature, webhook_secret):
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Invalid signature'}),
                'isBase64Encoded': False
            }
        
        payload = json.loads(body)
        
        invoice_id = payload.get('uuid')
        amount_crypto = float(payload.get('amount_crypto', 0))
        currency = payload.get('currency', '')
        status = payload.get('status', '')
        
        if not all([invoice_id, amount_crypto, currency, status]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        conn = psycopg2.connect(db_url, options=f'-c search_path={schema}')
        conn.autocommit = False
        
        try:
            result = process_payment(invoice_id, amount_crypto, currency, status, conn)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(result),
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
