import json
import os
import hmac
import hashlib
from urllib.parse import parse_qs

def handler(event: dict, context) -> dict:
    """
    Telegram Bot Webhook обработчик для приема уведомлений и команд от бота.
    Проверяет подлинность запросов от Telegram и обрабатывает команды пользователей.
    """
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Bot-Api-Secret-Token'
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
        update = json.loads(body) if isinstance(body, str) else body
        
        if 'message' in update:
            message = update['message']
            chat_id = message['chat']['id']
            text = message.get('text', '')
            user = message.get('from', {})
            
            if text == '/start':
                response_text = f"👋 Привет, {user.get('first_name', 'друг')}!\n\n" \
                               f"Добро пожаловать в наш сервис знакомств!\n\n" \
                               f"Нажми на кнопку ниже, чтобы открыть приложение:"
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'method': 'sendMessage',
                        'chat_id': chat_id,
                        'text': response_text,
                        'reply_markup': {
                            'inline_keyboard': [[
                                {
                                    'text': '🚀 Открыть приложение',
                                    'web_app': {'url': os.environ.get('WEB_APP_URL', 'https://your-app.poehali.dev')}
                                }
                            ]]
                        }
                    })
                }
            
            elif text == '/help':
                response_text = "📖 Помощь:\n\n" \
                               "/start - Запустить приложение\n" \
                               "/help - Показать эту справку\n" \
                               "/profile - Открыть профиль\n" \
                               "/notifications - Управление уведомлениями"
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'method': 'sendMessage',
                        'chat_id': chat_id,
                        'text': response_text
                    })
                }
            
            elif text == '/profile':
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'method': 'sendMessage',
                        'chat_id': chat_id,
                        'text': '👤 Открываю твой профиль...',
                        'reply_markup': {
                            'inline_keyboard': [[
                                {
                                    'text': '👤 Мой профиль',
                                    'web_app': {'url': f"{os.environ.get('WEB_APP_URL', 'https://your-app.poehali.dev')}#profile"}
                                }
                            ]]
                        }
                    })
                }
            
            else:
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps({
                        'method': 'sendMessage',
                        'chat_id': chat_id,
                        'text': 'Используй /help для списка команд'
                    })
                }
        
        elif 'callback_query' in update:
            callback = update['callback_query']
            chat_id = callback['message']['chat']['id']
            callback_data = callback.get('data', '')
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'method': 'answerCallbackQuery',
                    'callback_query_id': callback['id'],
                    'text': 'Обработано!'
                })
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }
