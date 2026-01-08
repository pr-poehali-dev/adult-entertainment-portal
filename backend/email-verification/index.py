'''Отправка кодов подтверждения email и проверка'''
import json
import os
import psycopg2
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import hashlib

DATABASE_URL = os.environ['DATABASE_URL']
SCHEMA = os.environ['MAIN_DB_SCHEMA']
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
        
        if action == 'send_code':
            return send_verification_code(body)
        elif action == 'verify_code':
            return verify_code(body)
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

def send_verification_code(body: dict) -> dict:
    email = body.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email обязателен'})
        }
    
    if not SMTP_USER or not SMTP_PASSWORD:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email сервис не настроен. Пожалуйста, добавьте SMTP_USER и SMTP_PASSWORD в секреты проекта.'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        code = str(random.randint(100000, 999999))
        
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        cur.execute(f'''
            DELETE FROM {SCHEMA}.email_verification_tokens 
            WHERE expires_at < CURRENT_TIMESTAMP
        ''')
        
        cur.execute(f'''
            INSERT INTO {SCHEMA}.email_verification_tokens (user_id, token_hash, expires_at, created_at)
            VALUES (NULL, %s, %s, CURRENT_TIMESTAMP)
        ''', (code_hash, datetime.utcnow() + timedelta(minutes=10)))
        conn.commit()
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Код подтверждения email'
        msg['From'] = SMTP_USER
        msg['To'] = email
        
        html = f'''
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Подтверждение email</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Ваш код подтверждения:
              </p>
              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px;">{code}</span>
              </div>
              <p style="color: #999; font-size: 14px;">
                Код действителен 10 минут
              </p>
            </div>
          </body>
        </html>
        '''
        
        text = f'Ваш код подтверждения: {code}\nКод действителен 10 минут'
        
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'message': 'Код отправлен на email',
                'expires_in': 600
            })
        }
    except smtplib.SMTPAuthenticationError:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Ошибка авторизации SMTP. Проверьте SMTP_USER и SMTP_PASSWORD в секретах.'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Ошибка отправки email: {str(e)}'})
        }
    finally:
        cur.close()
        conn.close()

def verify_code(body: dict) -> dict:
    code = body.get('code', '').strip()
    
    if not code:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Код обязателен'})
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        cur.execute(f'''
            SELECT id, expires_at 
            FROM {SCHEMA}.email_verification_tokens 
            WHERE token_hash = %s
        ''', (code_hash,))
        
        result = cur.fetchone()
        
        if not result:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Неверный код'})
            }
        
        token_id, expires_at = result
        
        if datetime.utcnow() > expires_at:
            cur.execute(f'DELETE FROM {SCHEMA}.email_verification_tokens WHERE id = %s', (token_id,))
            conn.commit()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Срок действия кода истек'})
            }
        
        cur.execute(f'DELETE FROM {SCHEMA}.email_verification_tokens WHERE id = %s', (token_id,))
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Email успешно подтвержден', 'verified': True})
        }
    finally:
        cur.close()
        conn.close()
