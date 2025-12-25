import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import time

def handler(event: dict, context) -> dict:
    """Отправка email для восстановления пароля"""
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        email = body.get('email', '').strip()
        
        if not email:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email обязателен'}),
                'isBase64Encoded': False
            }
        
        # Генерируем токен для восстановления
        reset_token = secrets.token_urlsafe(32)
        
        # Получаем SMTP настройки из переменных окружения
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        
        if not all([smtp_host, smtp_user, smtp_password]):
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'SMTP не настроен'}),
                'isBase64Encoded': False
            }
        
        # Создаём письмо
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Восстановление пароля - Love Is'
        msg['From'] = smtp_user
        msg['To'] = email
        
        # HTML версия письма
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>❤️ Love Is</h1>
                    <p>Восстановление пароля</p>
                </div>
                <div class="content">
                    <h2>Здравствуйте!</h2>
                    <p>Вы запросили восстановление пароля для вашего аккаунта.</p>
                    <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
                    <div style="text-align: center;">
                        <a href="https://preview--adult-entertainment-portal.poehali.dev/?reset_token={reset_token}" class="button">
                            Восстановить пароль
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
                    <p style="color: #666; font-size: 14px;">Ссылка действительна в течение 1 часа.</p>
                </div>
                <div class="footer">
                    <p>© 2026 Love Is. Все права защищены.</p>
                    <p>Это автоматическое письмо, не отвечайте на него.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Текстовая версия письма
        text_content = f"""
        Love Is - Восстановление пароля
        
        Здравствуйте!
        
        Вы запросили восстановление пароля для вашего аккаунта.
        
        Перейдите по ссылке для создания нового пароля:
        https://preview--adult-entertainment-portal.poehali.dev/?reset_token={reset_token}
        
        Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
        Ссылка действительна в течение 1 часа.
        
        © 2026 Love Is. Все права защищены.
        """
        
        part1 = MIMEText(text_content, 'plain', 'utf-8')
        part2 = MIMEText(html_content, 'html', 'utf-8')
        
        msg.attach(part1)
        msg.attach(part2)
        
        # Отправляем письмо
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Письмо отправлено',
                'email': email
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Ошибка отправки письма',
                'details': str(e)
            }),
            'isBase64Encoded': False
        }
