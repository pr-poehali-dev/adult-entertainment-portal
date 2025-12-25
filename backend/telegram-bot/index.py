import json
import os
import hmac
import hashlib
import requests
from urllib.parse import parse_qs

def handler(event: dict, context) -> dict:
    """
    Telegram Bot Webhook обработчик для команд бота и Telegram Payments.
    Поддерживает: /start, /help, /profile, создание инвойсов, обработку платежей.
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
        data = json.loads(body) if isinstance(body, str) else body
        
        if 'action' in data:
            return handle_payment_action(data, bot_token)
        
        update = data
        
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
        
        elif 'pre_checkout_query' in update:
            query = update['pre_checkout_query']
            query_id = query['id']
            
            telegram_data = {
                'pre_checkout_query_id': query_id,
                'ok': True
            }
            
            requests.post(
                f'https://api.telegram.org/bot{bot_token}/answerPreCheckoutQuery',
                json=telegram_data,
                timeout=5
            )
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        elif 'message' in update and 'successful_payment' in update['message']:
            payment = update['message']['successful_payment']
            payload = json.loads(payment.get('invoice_payload', '{}'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'ok': True,
                    'payment': {
                        'amount': payment.get('total_amount', 0) / 100,
                        'currency': payment.get('currency'),
                        'payload': payload,
                        'telegram_payment_charge_id': payment.get('telegram_payment_charge_id'),
                        'provider_payment_charge_id': payment.get('provider_payment_charge_id')
                    }
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


def handle_payment_action(data: dict, bot_token: str) -> dict:
    """Обработка действий с платежами"""
    action = data.get('action')
    payment_provider_token = os.environ.get('TELEGRAM_PAYMENT_PROVIDER_TOKEN')
    
    if not payment_provider_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Payment provider token not configured'})
        }
    
    if action == 'create_invoice':
        chat_id = data.get('chatId')
        title = data.get('title', 'Пополнение баланса')
        description = data.get('description', 'Пополнение баланса в приложении')
        amount = data.get('amount')
        currency = data.get('currency', 'RUB')
        payload = data.get('payload', {})
        
        if not chat_id or not amount:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'chatId and amount are required'})
            }
        
        telegram_data = {
            'chat_id': chat_id,
            'title': title,
            'description': description,
            'payload': json.dumps(payload),
            'provider_token': payment_provider_token,
            'currency': currency,
            'prices': [{'label': title, 'amount': int(amount * 100)}]
        }
        
        response = requests.post(
            f'https://api.telegram.org/bot{bot_token}/sendInvoice',
            json=telegram_data,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'message_id': result.get('result', {}).get('message_id')
                })
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'error': 'Failed to create invoice',
                    'details': response.text
                })
            }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action'})
    }