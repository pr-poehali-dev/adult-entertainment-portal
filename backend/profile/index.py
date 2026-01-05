import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt

DATABASE_URL = os.environ.get('DATABASE_URL')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
JWT_SECRET = os.environ.get('JWT_SECRET')

def verify_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except:
        return None

def handler(event: dict, context) -> dict:
    """API для получения и обновления профиля пользователя"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    auth_header = event.get('headers', {}).get('x-authorization', '')
    token = auth_header.replace('Bearer ', '') if auth_header else ''
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Токен не предоставлен'}),
            'isBase64Encoded': False
        }
    
    payload = verify_token(token)
    if not payload:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный или истекший токен'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(DATABASE_URL, options=f'-c search_path={SCHEMA}')
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, email, username, nickname, role, name, bio, avatar_url, 
                       phone, telegram_username, verified, is_premium, agency_id, 
                       agency_name, business_type, referral_code, created_at
                FROM users WHERE id = %s
            """, (payload['user_id'],))
            
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'username': user['username'],
                        'nickname': user['nickname'],
                        'role': user['role'],
                        'name': user['name'],
                        'bio': user['bio'],
                        'avatar': user['avatar_url'],
                        'phone': user['phone'],
                        'telegram': user['telegram_username'],
                        'verified': user['verified'],
                        'isPremium': user['is_premium'],
                        'isAgencyOwner': user['agency_id'] is not None,
                        'agencyName': user['agency_name'],
                        'businessType': user['business_type'],
                        'referralCode': user['referral_code'],
                        'createdAt': user['created_at'].isoformat() if user['created_at'] else None
                    }
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            
            update_fields = []
            update_values = []
            
            allowed_fields = {
                'nickname': 'nickname',
                'name': 'name',
                'bio': 'bio',
                'avatar': 'avatar_url',
                'phone': 'phone',
                'telegram': 'telegram_username'
            }
            
            for field_key, db_column in allowed_fields.items():
                if field_key in data:
                    update_fields.append(f"{db_column} = %s")
                    update_values.append(data[field_key])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Нет полей для обновления'}),
                    'isBase64Encoded': False
                }
            
            update_values.append(payload['user_id'])
            
            cur.execute(f"""
                UPDATE users 
                SET {', '.join(update_fields)}, updated_at = NOW()
                WHERE id = %s
                RETURNING id, email, username, nickname, role, name, bio, avatar_url, 
                          phone, telegram_username, verified, is_premium
            """, update_values)
            
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'username': user['username'],
                        'nickname': user['nickname'],
                        'role': user['role'],
                        'name': user['name'],
                        'bio': user['bio'],
                        'avatar': user['avatar_url'],
                        'phone': user['phone'],
                        'telegram': user['telegram_username'],
                        'verified': user['verified'],
                        'isPremium': user['is_premium']
                    }
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Метод не поддерживается'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()
