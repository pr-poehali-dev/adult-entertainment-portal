'''Аутентификация пользователей через email и пароль с JWT токенами'''
import json
import os
import psycopg2
import bcrypt
import jwt
from datetime import datetime, timedelta

DATABASE_URL = os.environ['DATABASE_URL']
SCHEMA = os.environ['MAIN_DB_SCHEMA']
JWT_SECRET = os.environ['JWT_SECRET']

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
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
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'login':
            return login(body)
        elif action == 'register':
            return register(body)
        elif action == 'verify_token':
            return verify_token(body)
        elif action == 'forgot_password':
            return forgot_password(body)
        elif action == 'reset_password':
            return reset_password(body)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

def login(body: dict) -> dict:
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email и пароль обязательны'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        cur.execute(f'''
            SELECT id, email, password_hash, username, role, name, avatar_url, 
                   agency_id, agency_name, failed_login_attempts
            FROM {SCHEMA}.users 
            WHERE email = %s
        ''', (email,))
        
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный email или пароль'})
            }
        
        user_id, user_email, password_hash, username, role, name, avatar_url, agency_id, agency_name, failed_attempts = user
        
        if failed_attempts >= 5:
            return {
                'statusCode': 429,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Аккаунт заблокирован. Слишком много попыток входа'})
            }
        
        if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
            cur.execute(f'''
                UPDATE {SCHEMA}.users 
                SET failed_login_attempts = failed_login_attempts + 1,
                    last_failed_login_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (user_id,))
            conn.commit()
            
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный email или пароль'})
            }
        
        cur.execute(f'''
            UPDATE {SCHEMA}.users 
            SET last_login_at = CURRENT_TIMESTAMP,
                failed_login_attempts = 0
            WHERE id = %s
        ''', (user_id,))
        conn.commit()
        
        access_token = jwt.encode({
            'user_id': user_id,
            'email': user_email,
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, JWT_SECRET, algorithm='HS256')
        
        refresh_token = jwt.encode({
            'user_id': user_id,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user_id,
                    'email': user_email,
                    'username': username,
                    'role': role,
                    'name': name,
                    'avatar_url': avatar_url,
                    'agency_id': agency_id,
                    'agency_name': agency_name
                }
            })
        }
    finally:
        cur.close()
        conn.close()

def register(body: dict) -> dict:
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    username = body.get('username', '').strip()
    role = body.get('role', 'buyer')
    
    if not email or not password or not username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email, пароль и имя обязательны'})
        }
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        cur.execute(f'SELECT id FROM {SCHEMA}.users WHERE email = %s', (email,))
        if cur.fetchone():
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Пользователь с таким email уже существует'})
            }
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        cur.execute(f'''
            INSERT INTO {SCHEMA}.users (email, password_hash, username, role, created_at)
            VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id, email, username, role
        ''', (email, password_hash, username, role))
        
        user = cur.fetchone()
        conn.commit()
        
        user_id, user_email, user_username, user_role = user
        
        access_token = jwt.encode({
            'user_id': user_id,
            'email': user_email,
            'role': user_role,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, JWT_SECRET, algorithm='HS256')
        
        refresh_token = jwt.encode({
            'user_id': user_id,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': {
                    'id': user_id,
                    'email': user_email,
                    'username': user_username,
                    'role': user_role
                }
            })
        }
    finally:
        cur.close()
        conn.close()

def verify_token(body: dict) -> dict:
    token = body.get('token', '')
    
    if not token:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token is required'})
        }
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'valid': True,
                'user_id': payload.get('user_id'),
                'email': payload.get('email'),
                'role': payload.get('role')
            })
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token expired', 'valid': False})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid token', 'valid': False})
        }

def forgot_password(body: dict) -> dict:
    email = body.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        cur.execute(f'SELECT id FROM {SCHEMA}.users WHERE email = %s', (email,))
        user = cur.fetchone()
        
        if not user:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Если email существует, письмо будет отправлено'})
            }
        
        user_id = user[0]
        reset_token = jwt.encode({
            'user_id': user_id,
            'type': 'reset_password',
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, JWT_SECRET, algorithm='HS256')
        
        import hashlib
        token_hash = hashlib.sha256(reset_token.encode('utf-8')).hexdigest()
        
        cur.execute(f'''
            INSERT INTO {SCHEMA}.password_reset_tokens (user_id, token_hash, expires_at, created_at)
            VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
        ''', (user_id, token_hash, datetime.utcnow() + timedelta(hours=1)))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Ссылка для восстановления пароля отправлена на email',
                'reset_token': reset_token
            })
        }
    finally:
        cur.close()
        conn.close()

def reset_password(body: dict) -> dict:
    token = body.get('token', '')
    new_password = body.get('new_password', '')
    
    if not token or not new_password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token и новый пароль обязательны'})
        }
    
    if len(new_password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})
        }
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user_id = payload.get('user_id')
        
        if payload.get('type') != 'reset_password':
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный тип токена'})
            }
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        try:
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute(f'''
                UPDATE {SCHEMA}.users 
                SET password_hash = %s, 
                    failed_login_attempts = 0,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (password_hash, user_id))
            
            cur.execute(f'''
                DELETE FROM {SCHEMA}.password_reset_tokens 
                WHERE user_id = %s
            ''', (user_id,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Пароль успешно изменен'})
            }
        finally:
            cur.close()
            conn.close()
            
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Срок действия ссылки истек'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный токен'})
        }