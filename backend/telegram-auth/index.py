import json
import os
import hashlib
import hmac
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt

def verify_telegram_auth(auth_data: dict, bot_token: str) -> bool:
    """
    Проверка подлинности данных от Telegram Login Widget
    """
    check_hash = auth_data.pop('hash', None)
    if not check_hash:
        return False
    
    data_check_arr = [f"{k}={v}" for k, v in sorted(auth_data.items())]
    data_check_string = '\n'.join(data_check_arr)
    
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    hmac_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    
    if hmac_hash != check_hash:
        return False
    
    auth_date = int(auth_data.get('auth_date', 0))
    if datetime.utcnow().timestamp() - auth_date > 86400:
        return False
    
    return True

def generate_token(user_id: int, email: str) -> str:
    """Генерация JWT токена для сессии"""
    jwt_secret = os.environ.get('JWT_SECRET')
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, jwt_secret, algorithm='HS256')

def get_db_connection():
    """Подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: dict, context) -> dict:
    """
    Обработка авторизации через Telegram Login Widget.
    Автоматическая регистрация новых пользователей.
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Bot token not configured'})
            }
        
        body = event.get('body', '{}')
        data = json.loads(body) if isinstance(body, str) else body
        
        auth_data = data.copy()
        
        if not verify_telegram_auth(auth_data, bot_token):
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid Telegram authentication'})
            }
        
        telegram_id = int(data.get('id'))
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        username = data.get('username', f'user{telegram_id}')
        photo_url = data.get('photo_url')
        
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        cur.execute(f"""
            SELECT id, email, username, role, telegram_id, avatar_url
            FROM {schema}.users
            WHERE telegram_id = %s
        """, (telegram_id,))
        
        user = cur.fetchone()
        
        if user:
            cur.execute(f"""
                UPDATE {schema}.users
                SET last_login_at = CURRENT_TIMESTAMP,
                    telegram_username = %s,
                    avatar_url = COALESCE(avatar_url, %s)
                WHERE telegram_id = %s
            """, (username, photo_url, telegram_id))
            conn.commit()
            
            token = generate_token(user['id'], user['email'])
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': user['id'],
                        'email': user['email'],
                        'username': user['username'],
                        'role': user['role'],
                        'telegram_id': user['telegram_id'],
                        'avatar_url': user['avatar_url']
                    }
                })
            }
        else:
            display_name = f"{first_name} {last_name}".strip() or username
            email = f"telegram_{telegram_id}@temp.local"
            
            import secrets
            import string
            temp_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))
            
            import bcrypt
            password_hash = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            referral_code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            
            cur.execute(f"""
                INSERT INTO {schema}.users 
                (email, password_hash, username, role, telegram_id, telegram_username, avatar_url, referral_code, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                RETURNING id, email, username, role, telegram_id, avatar_url
            """, (email, password_hash, display_name, 'buyer', telegram_id, username, photo_url, referral_code))
            
            new_user = cur.fetchone()
            conn.commit()
            
            token = generate_token(new_user['id'], new_user['email'])
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': new_user['id'],
                        'email': new_user['email'],
                        'username': new_user['username'],
                        'role': new_user['role'],
                        'telegram_id': new_user['telegram_id'],
                        'avatar_url': new_user['avatar_url']
                    },
                    'new_user': True
                })
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }
