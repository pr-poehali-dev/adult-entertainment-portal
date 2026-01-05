import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import bcrypt
from datetime import datetime, timedelta

DATABASE_URL = os.environ.get('DATABASE_URL')
SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

def generate_reset_code():
    """Генерация 6-значного кода"""
    return ''.join(secrets.choice('0123456789') for _ in range(6))

def send_reset_email(email: str, code: str):
    """Отправка письма с кодом сброса"""
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password]):
        raise Exception('SMTP не настроен')
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = '🔐 Код для сброса пароля'
    msg['From'] = smtp_user
    msg['To'] = email
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 30px; }}
            .header h1 {{ color: #ec4899; margin: 0; }}
            .code-box {{ background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; letter-spacing: 8px; margin: 30px 0; }}
            .warning {{ background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-top: 20px; }}
            .footer {{ text-align: center; color: #888; margin-top: 30px; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Восстановление пароля</h1>
                <p>Ваш код для сброса пароля</p>
            </div>
            
            <p>Вы запросили сброс пароля. Используйте код ниже для создания нового пароля:</p>
            
            <div class="code-box">
                {code}
            </div>
            
            <p style="text-align: center; color: #666;">Код действителен в течение <strong>15 минут</strong></p>
            
            <div class="warning">
                <strong>⚠️ Важно!</strong> Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
            </div>
            
            <div class="footer">
                <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Восстановление пароля
    
    Ваш код для сброса пароля: {code}
    
    Код действителен в течение 15 минут.
    
    Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
    """
    
    part1 = MIMEText(text_content, 'plain', 'utf-8')
    part2 = MIMEText(html_content, 'html', 'utf-8')
    
    msg.attach(part1)
    msg.attach(part2)
    
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

def handler(event: dict, context) -> dict:
    """API для сброса пароля через email"""
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Метод не поддерживается'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(DATABASE_URL, options=f'-c search_path={SCHEMA}')
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if action == 'request_reset':
            email = body.get('email', '').lower().strip()
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'message': 'Если email существует, код был отправлен'}),
                    'isBase64Encoded': False
                }
            
            code = generate_reset_code()
            expires_at = datetime.utcnow() + timedelta(minutes=15)
            
            cur.execute("""
                INSERT INTO password_reset_codes (user_id, code, expires_at)
                VALUES (%s, %s, %s)
            """, (user['id'], code, expires_at))
            
            conn.commit()
            
            try:
                send_reset_email(email, code)
            except Exception as e:
                conn.rollback()
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Ошибка отправки email: {str(e)}'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Код отправлен на email'}),
                'isBase64Encoded': False
            }
        
        elif action == 'verify_and_reset':
            email = body.get('email', '').lower().strip()
            code = body.get('code', '').strip()
            new_password = body.get('newPassword', '')
            
            if not email or not code or not new_password:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Email, код и новый пароль обязательны'}),
                    'isBase64Encoded': False
                }
            
            if len(new_password) < 6:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(%s)", (email,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                SELECT id FROM password_reset_codes
                WHERE user_id = %s AND code = %s AND expires_at > NOW() AND used = FALSE
                ORDER BY created_at DESC
                LIMIT 1
            """, (user['id'], code))
            
            reset_code = cur.fetchone()
            
            if not reset_code:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Неверный или истекший код'}),
                    'isBase64Encoded': False
                }
            
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cur.execute("UPDATE users SET password_hash = %s, updated_at = NOW() WHERE id = %s", (password_hash, user['id']))
            cur.execute("UPDATE password_reset_codes SET used = TRUE WHERE id = %s", (reset_code['id'],))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Пароль успешно изменён'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверное действие'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
