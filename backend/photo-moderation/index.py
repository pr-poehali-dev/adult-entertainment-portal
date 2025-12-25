import json
import base64
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """
    AI-модератор фотографий для публичных изображений платформы.
    Использует GPT-4o Vision для анализа содержимого и выявления нарушений.
    """
    
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        image_base64 = body.get('imageBase64')
        user_name = body.get('userName', 'Пользователь')
        photo_type = body.get('photoType', 'profile')
        
        if not image_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Отсутствует изображение'}),
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
                'body': json.dumps({'error': 'API ключ не настроен'}),
                'isBase64Encoded': False
            }
        
        client = OpenAI(api_key=api_key)
        
        photo_type_text = {
            'avatar': 'аватара профиля',
            'profile': 'фотографии профиля',
            'catalog': 'изображения в каталоге услуг'
        }.get(photo_type, 'фотографии')
        
        moderation_prompt = f"""Ты строгий модератор фотографий для платформы знакомств и услуг для взрослых.

Анализируешь {photo_type_text} пользователя {user_name}.

ПРАВИЛА МОДЕРАЦИИ:

✅ РАЗРЕШЕНО:
- Профессиональные фото людей (портреты, полный рост)
- Эстетичные фото в нижнем белье или купальниках
- Художественные ню-фото без откровенных поз
- Фото в элегантных нарядах, вечерние образы
- Селфи, студийные фотосессии

❌ ЗАПРЕЩЕНО:
- Откровенная порнография, половые акты
- Детская порнография или подростки (моментальный отказ!)
- Насилие, жестокость, кровь
- Наркотики, оружие
- Скриншоты переписок или чужие фото
- Текст/реклама вместо фото человека
- Групповые фото без явного главного героя
- Очень низкое качество (размытые, темные)
- Мемы, картинки из интернета
- Фото животных вместо людей

АНАЛИЗИРУЙ:
1. Содержание фото (что изображено)
2. Соответствие правилам
3. Качество изображения
4. Подходит ли для {photo_type_text}

ОТВЕТЬ в JSON:
{{
  "approved": true/false,
  "confidence": 0-100,
  "reason": "краткая причина решения",
  "detectedContent": ["список найденных элементов"]
}}

ВАЖНО:
- Если есть хоть малейшее подозрение на несовершеннолетних - ОТКЛОНЯТЬ!
- Эротика разрешена, порнография - нет
- Сомневаешься? Лучше отклонить и дать модератору проверить вручную
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Ты профессиональный модератор изображений с опытом работы на платформах для взрослых. Ты строг, но справедлив."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": moderation_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content
        
        try:
            result_json = json.loads(result_text)
        except json.JSONDecodeError:
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                result_json = json.loads(json_match.group())
            else:
                result_json = {
                    "approved": False,
                    "confidence": 50,
                    "reason": "Не удалось разобрать ответ модели",
                    "detectedContent": []
                }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'approved': result_json.get('approved', False),
                'confidence': result_json.get('confidence', 0),
                'reason': result_json.get('reason', ''),
                'detectedContent': result_json.get('detectedContent', [])
            }, ensure_ascii=False),
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
                'error': 'Ошибка при модерации',
                'details': str(e)
            }),
            'isBase64Encoded': False
        }
