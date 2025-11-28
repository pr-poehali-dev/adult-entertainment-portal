import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
import os

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Sends registration credentials to user's email
    Args: event with httpMethod, body containing email, login, password, phone
          context with request_id
    Returns: HTTP response with status
    '''
    method: str = event.get('httpMethod', 'POST')
    
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
    
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email')
    login = body_data.get('login')
    password = body_data.get('password')
    phone = body_data.get('phone')
    
    if not all([email, login, password]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 10px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #4CAF50;
                margin: 0;
            }}
            .credentials {{
                background-color: #f9f9f9;
                border-left: 4px solid #4CAF50;
                padding: 20px;
                margin: 20px 0;
            }}
            .credential-item {{
                margin: 15px 0;
            }}
            .credential-label {{
                font-weight: bold;
                color: #555;
                display: block;
                margin-bottom: 5px;
            }}
            .credential-value {{
                font-size: 18px;
                color: #000;
                background-color: #e8f5e9;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
            }}
            .warning {{
                background-color: #fff3cd;
                border: 1px solid #ffc107;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }}
            .footer {{
                text-align: center;
                color: #888;
                margin-top: 30px;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Регистрация завершена!</h1>
                <p>Добро пожаловать в еженедельный розыгрыш iPhone 17</p>
            </div>
            
            <div class="credentials">
                <div class="credential-item">
                    <span class="credential-label">Ваш логин:</span>
                    <div class="credential-value">{login}</div>
                </div>
                
                <div class="credential-item">
                    <span class="credential-label">Ваш пароль:</span>
                    <div class="credential-value">{password}</div>
                </div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Важно!</strong> Сохраните эти данные в надёжном месте. 
                Они понадобятся для входа в аккаунт при следующих посещениях.
            </div>
            
            <p style="margin-top: 30px;">
                Теперь вы можете:
            </p>
            <ul>
                <li>Получить VIP статус за 500 ₽</li>
                <li>Купить билет за 100 ₽</li>
                <li>Участвовать в розыгрыше iPhone 17</li>
            </ul>
            
            <div class="footer">
                <p>Это автоматическое письмо. Пожалуйста, не отвечайте на него.</p>
                <p>Если у вас есть вопросы, свяжитесь с нашей службой поддержки.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        
        if not smtp_user or not smtp_password:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Email not configured, credentials generated'}),
                'isBase64Encoded': False
            }
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = '🎉 Ваши данные для входа - Розыгрыш iPhone 17'
        msg['From'] = smtp_user
        msg['To'] = email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
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
            'body': json.dumps({'message': 'Email sent successfully'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': f'Credentials generated, email skipped'}),
            'isBase64Encoded': False
        }
