import json
import os
import requests

def handler(event: dict, context) -> dict:
    """
    Отправка уведомлений пользователям через Telegram бота.
    Использует Telegram Bot API для отправки сообщений с кнопками и форматированием.
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Bot token not configured'})
            }
        
        body = event.get('body', '{}')
        data = json.loads(body) if isinstance(body, str) else body
        
        chat_id = data.get('chatId')
        message = data.get('message')
        notification_type = data.get('type', 'info')
        action_url = data.get('actionUrl')
        
        if not chat_id or not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'chatId and message are required'})
            }
        
        icons = {
            'message': '💬',
            'booking': '📅',
            'review': '⭐',
            'system': '🔔',
            'referral': '💰',
            'party_application': '🎉',
            'ad_response': '📝',
            'audio_approved': '✅',
            'audio_rejected': '❌',
            'photo_approved': '✅',
            'photo_rejected': '❌',
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        }
        
        icon = icons.get(notification_type, '🔔')
        formatted_message = f"{icon} {message}"
        
        telegram_data = {
            'chat_id': chat_id,
            'text': formatted_message,
            'parse_mode': 'HTML'
        }
        
        if action_url:
            web_app_url = os.environ.get('WEB_APP_URL', 'https://your-app.poehali.dev')
            full_url = f"{web_app_url}{action_url}" if action_url.startswith('#') else action_url
            
            telegram_data['reply_markup'] = {
                'inline_keyboard': [[
                    {
                        'text': '🚀 Открыть',
                        'web_app': {'url': full_url}
                    }
                ]]
            }
        
        response = requests.post(
            f'https://api.telegram.org/bot{bot_token}/sendMessage',
            json=telegram_data,
            timeout=10
        )
        
        if response.status_code == 200:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message': 'Notification sent'
                })
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Failed to send notification',
                    'details': response.text
                })
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
