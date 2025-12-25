import json
import os
import base64
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """
    AI-модератор аудио-приветствий для объявлений.
    Использует Whisper для распознавания речи и GPT-4 для анализа содержания.
    """
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
        audio_base64 = body.get('audioBase64')
        ad_title = body.get('adTitle', '')
        ad_description = body.get('adDescription', '')
        
        if not audio_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'audioBase64 is required'}),
                'isBase64Encoded': False
            }
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'}),
                'isBase64Encoded': False
            }
        
        client = OpenAI(api_key=api_key)
        
        audio_bytes = base64.b64decode(audio_base64)
        
        with open('/tmp/audio.webm', 'wb') as f:
            f.write(audio_bytes)
        
        with open('/tmp/audio.webm', 'rb') as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="ru"
            )
        
        transcript_text = transcription.text
        
        moderation_prompt = f"""
Ты модератор платформы знакомств и объявлений услуг для взрослых.

Проанализируй аудио-приветствие к объявлению:
Заголовок: {ad_title}
Описание: {ad_description}
Текст аудио: {transcript_text}

ПРАВИЛА МОДЕРАЦИИ:
✅ ОДОБРИТЬ если:
- Приветствие, представление автора
- Описание услуги или запроса
- Позитивное общение
- Информация о встрече, условиях
- Легкий флирт (без деталей)

❌ ОТКЛОНИТЬ если:
- Оскорбления, угрозы, агрессия
- Детальное описание сексуальных действий
- Упоминание наркотиков, оружия
- Прямые контакты (телефон, адрес)
- Реклама других сайтов/мессенджеров
- Финансовые мошенничества
- Пустое/нечитаемое аудио

Ответь ТОЛЬКО в формате JSON:
{{
  "approved": true/false,
  "reason": "краткая причина на русском (если отклонено)",
  "transcript": "распознанный текст",
  "confidence": 0-100
}}
"""
        
        moderation_result = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Ты строгий но справедливый модератор. Отвечаешь только JSON."},
                {"role": "user", "content": moderation_prompt}
            ],
            temperature=0.3
        )
        
        result_text = moderation_result.choices[0].message.content.strip()
        
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        result_text = result_text.strip()
        
        result_json = json.loads(result_text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'approved': result_json.get('approved', False),
                'reason': result_json.get('reason', ''),
                'transcript': result_json.get('transcript', transcript_text),
                'confidence': result_json.get('confidence', 50)
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
                'error': str(e),
                'approved': False,
                'reason': 'Ошибка при анализе аудио'
            }),
            'isBase64Encoded': False
        }
