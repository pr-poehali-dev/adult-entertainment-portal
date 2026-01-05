import json
import os
import secrets
import string
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import bcrypt
import jwt

def generate_referral_code():
    """Генерация уникального реферального кода"""
    return ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Проверка пароля"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

def generate_token(user_id: int, email: str) -> str:
    """Генерация JWT токена для сессии"""
    jwt_secret = os.environ.get('JWT_SECRET')
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, jwt_secret, algorithm='HS256')

def verify_token(token: str):
    """Проверка JWT токена"""
    try:
        jwt_secret = os.environ.get('JWT_SECRET')
        return jwt.decode(token, jwt_secret, algorithms=['HS256'])
    except:
        return None

def send_credentials_email(email: str, username: str, password: str):
    """Отправка письма с данными для входа"""
    smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    
    if not smtp_user or not smtp_password:
        print('SMTP not configured')
        return
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #4CAF50; margin: 0; }}
            .credentials {{ background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 20px; margin: 20px 0; }}
            .credential-item {{ margin: 15px 0; }}
            .credential-label {{ font-weight: bold; color: #555; display: block; margin-bottom: 5px; }}
            .credential-value {{ font-size: 18px; color: #000; background-color: #e8f5e9; padding: 10px; border-radius: 5px; font-family: monospace; }}
            .warning {{ background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px; }}
            .footer {{ text-align: center; color: #888; margin-top: 30px; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Регистрация завершена!</h1>
                <p>Добро пожаловать в наш сервис</p>
            </div>
            
            <div class="credentials">
                <div class="credential-item">
                    <span class="credential-label">Ваш email:</span>
                    <div class="credential-value">{email}</div>
                </div>
                
                <div class="credential-item">
                    <span class="credential-label">Ваше имя:</span>
                    <div class="credential-value">{username}</div>
                </div>
                
                <div class="credential-item">
                    <span class="credential-label">Ваш пароль:</span>
                    <div class="credential-value">{password}</div>
                </div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Важно!</strong> Сохраните эти данные в надёжном месте.
            </div>
            
            <div class="footer">
                <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '🎉 Добро пожаловать!'
    msg['From'] = smtp_user
    msg['To'] = email
    
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)
    
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

def ensure_admin_exists(cur):
    """Создаёт администратора если его нет в базе"""
    admin_email = os.environ.get('ADMIN_EMAIL')
    admin_password = os.environ.get('ADMIN_PASSWORD')
    
    if not admin_email or not admin_password:
        return
    
    cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (admin_email,))
    if cur.fetchone():
        return
    
    password_hash = hash_password(admin_password)
    referral_code = generate_referral_code()
    
    cur.execute("""
        INSERT INTO users (
            email, password_hash, username, role, 
            referral_code, profile_completed, kyc_completed
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (admin_email, password_hash, 'Администратор', 'admin', referral_code, True, True))
    
    admin = cur.fetchone()
    
    for currency in ['RUB', 'USD', 'EUR', 'LOVE']:
        initial_amount = 10000 if currency == 'LOVE' else 1000000
        cur.execute("""
            INSERT INTO wallets (user_id, currency, amount)
            VALUES (%s, %s, %s)
        """, (admin['id'], currency, initial_amount))

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
            ensure_admin_exists(cur)
            
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
                
                # Отправка письма с данными для входа
                try:
                    send_credentials_email(email, username, password)
                except Exception as e:
                    print(f'Email send error: {e}')
                
                token = generate_token(user['id'], user['email'])
                
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
                
                cur.execute("""
                    SELECT id, email, username, role, business_type, referral_code,
                           profile_completed, kyc_completed, verified, is_premium, password_hash
                    FROM users 
                    WHERE LOWER(email) = LOWER(%s)
                """, (email,))
                
                user = cur.fetchone()
                
                if not user or not verify_password(password, user['password_hash']):
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Invalid credentials'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("UPDATE users SET last_login_at = %s WHERE id = %s", (datetime.utcnow(), user['id']))
                conn.commit()
                
                token = generate_token(user['id'], user['email'])
                
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