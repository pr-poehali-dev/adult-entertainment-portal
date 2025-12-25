import os
import psycopg2
import json
from datetime import datetime

def get_db_connection():
    """Создать подключение к БД"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise Exception('DATABASE_URL not configured')
    return psycopg2.connect(dsn)

def save_payment(telegram_user_id: int, payment_data: dict) -> bool:
    """Сохранить информацию о платеже в БД"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO telegram_payments (
                telegram_user_id,
                telegram_payment_charge_id,
                provider_payment_charge_id,
                amount,
                currency,
                payload,
                status,
                processed_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (telegram_payment_charge_id) DO NOTHING
        """, (
            telegram_user_id,
            payment_data.get('telegram_payment_charge_id'),
            payment_data.get('provider_payment_charge_id'),
            payment_data.get('amount'),
            payment_data.get('currency', 'RUB'),
            json.dumps(payment_data.get('payload', {})),
            'completed',
            datetime.now()
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving payment: {e}")
        return False

def notify_frontend(telegram_user_id: int, payment_data: dict):
    """Отправить уведомление фронтенду о зачислении средств"""
    import requests
    
    notify_url = os.environ.get('WEB_APP_URL', '')
    if not notify_url:
        return
    
    try:
        requests.post(
            f'{notify_url}/api/payment-webhook',
            json={
                'telegram_user_id': telegram_user_id,
                'payment': payment_data
            },
            timeout=5
        )
    except Exception as e:
        print(f"Error notifying frontend: {e}")
