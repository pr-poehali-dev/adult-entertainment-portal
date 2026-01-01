import json
import os
import hashlib
import secrets
import string
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def generate_referral_code():
    """Генерация уникального реферального кода"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id: int) -> str:
    """Генерация токена для сессии"""
    token_data = f"{user_id}:{datetime.utcnow().isoformat()}:{secrets.token_hex(16)}"
    return hashlib.sha256(token_data.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """API для регистрации и авторизации пользователей"""
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        action = data.get('action')
        
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        conn = psycopg2.connect(db_url, options=f'-c search_path={schema}')
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            
            if action == 'register':
                email = data.get('email')
                password = data.get('password')
                username = data.get('username')
                is_business = data.get('isBusinessMode', False)
                business_type = data.get('businessType')
                referral_code_input = data.get('referralCode')
                
                if not email or not password or not username:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
                if cur.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Email already exists'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                user_referral_code = generate_referral_code()
                role = 'business' if is_business else 'buyer'
                referred_by_id = None
                
                if referral_code_input:
                    cur.execute("SELECT id FROM users WHERE referral_code = %s", (referral_code_input,))
                    referrer = cur.fetchone()
                    if referrer:
                        referred_by_id = referrer['id']
                
                cur.execute("""
                    INSERT INTO users (
                        email, password_hash, username, role, business_type, 
                        referral_code, referred_by_id, profile_completed, kyc_completed
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, email, username, role, business_type, referral_code
                """, (
                    email, password_hash, username, role, business_type,
                    user_referral_code, referred_by_id, 
                    True if is_business else False,
                    True if is_business else False
                ))
                
                user = cur.fetchone()
                
                for currency in ['RUB', 'USD', 'EUR', 'LOVE']:
                    initial_amount = 1000 if currency == 'LOVE' else 0
                    cur.execute("""
                        INSERT INTO wallets (user_id, currency, amount)
                        VALUES (%s, %s, %s)
                    """, (user['id'], currency, initial_amount))
                
                if referred_by_id:
                    cur.execute("""
                        UPDATE wallets 
                        SET amount = amount + 100 
                        WHERE user_id = %s AND currency = 'LOVE'
                    """, (referred_by_id,))
                    
                    cur.execute("""
                        INSERT INTO wallet_transactions (
                            user_id, type, amount, currency, status, 
                            description, referral_level, completed_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        referred_by_id, 'referral_bonus', 100, 'LOVE', 'completed',
                        f'Бонус за реферала: {username}', 1, datetime.utcnow()
                    ))
                
                conn.commit()
                
                token = generate_token(user['id'])
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'email': user['email'],
                            'username': user['username'],
                            'role': user['role'],
                            'businessType': user['business_type'],
                            'referralCode': user['referral_code']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = data.get('email')
                password = data.get('password')
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing email or password'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute("""
                    SELECT id, email, username, role, business_type, referral_code,
                           profile_completed, kyc_completed, verified, is_premium
                    FROM users 
                    WHERE LOWER(email) = LOWER(%s) AND password_hash = %s
                """, (email, password_hash))
                
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE users SET last_login_at = %s WHERE id = %s", (datetime.utcnow(), user['id']))
                conn.commit()
                
                token = generate_token(user['id'])
                
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
                            'businessType': user['business_type'],
                            'referralCode': user['referral_code'],
                            'profileCompleted': user['profile_completed'],
                            'kycCompleted': user['kyc_completed'],
                            'verified': user['verified'],
                            'isPremium': user['is_premium']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }