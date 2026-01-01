import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_id_from_token(headers: dict) -> int:
    """Извлечение user_id из токена"""
    auth_header = headers.get('x-authorization', headers.get('X-Authorization', ''))
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '')
    return int(token.split(':')[0]) if ':' in token else None

def handler(event: dict, context) -> dict:
    """API для работы с объявлениями каталога"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        conn = psycopg2.connect(db_url, options=f'-c search_path={schema}')
        conn.autocommit = False
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            
            if method == 'GET':
                query_params = event.get('queryStringParameters', {}) or {}
                location = query_params.get('location')
                category = query_params.get('category')
                is_active = query_params.get('active', 'true') == 'true'
                
                query = """
                    SELECT 
                        id, user_id, agency_id, agency_name, title, description,
                        price, category, age, height, body_type, country, location,
                        image_url, avatar_url, images, is_active, is_verified,
                        work_schedule, views_count, bookings_count, rating,
                        created_at, updated_at
                    FROM catalog_items
                    WHERE is_active = %s
                """
                params = [is_active]
                
                if location:
                    query += " AND location ILIKE %s"
                    params.append(f"%{location}%")
                
                if category:
                    query += " AND category = %s"
                    params.append(category)
                
                query += " ORDER BY created_at DESC LIMIT 100"
                
                cur.execute(query, params)
                items = cur.fetchall()
                
                result = []
                for item in items:
                    result.append({
                        'id': item['id'],
                        'userId': item['user_id'],
                        'agencyId': item['agency_id'],
                        'agencyName': item['agency_name'],
                        'title': item['title'],
                        'description': item['description'],
                        'price': item['price'],
                        'category': item['category'],
                        'age': item['age'],
                        'height': item['height'],
                        'bodyType': item['body_type'],
                        'country': item['country'],
                        'location': item['location'],
                        'imageUrl': item['image_url'],
                        'avatarUrl': item['avatar_url'],
                        'images': item['images'] or [],
                        'isActive': item['is_active'],
                        'isVerified': item['is_verified'],
                        'workSchedule': item['work_schedule'],
                        'viewsCount': item['views_count'],
                        'bookingsCount': item['bookings_count'],
                        'rating': float(item['rating']) if item['rating'] else 0,
                        'createdAt': item['created_at'].isoformat() if item['created_at'] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'items': result}),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                user_id = get_user_id_from_token(event.get('headers', {}))
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                data = json.loads(event.get('body', '{}'))
                
                cur.execute("""
                    INSERT INTO catalog_items (
                        user_id, agency_id, agency_name, title, description, price,
                        category, age, height, body_type, country, location,
                        image_url, avatar_url, images, work_schedule, is_active
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    user_id,
                    data.get('agencyId'),
                    data.get('agencyName'),
                    data.get('title'),
                    data.get('description'),
                    data.get('price'),
                    data.get('category'),
                    data.get('age'),
                    data.get('height'),
                    data.get('bodyType'),
                    data.get('country'),
                    data.get('location'),
                    data.get('imageUrl'),
                    data.get('avatarUrl'),
                    data.get('images', []),
                    json.dumps(data.get('workSchedule')) if data.get('workSchedule') else None,
                    data.get('isActive', True)
                ))
                
                item_id = cur.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'itemId': item_id}),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                user_id = get_user_id_from_token(event.get('headers', {}))
                if not user_id:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Unauthorized'}),
                        'isBase64Encoded': False
                    }
                
                data = json.loads(event.get('body', '{}'))
                item_id = data.get('itemId')
                
                if not item_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Item ID is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT user_id FROM catalog_items WHERE id = %s", (item_id,))
                item = cur.fetchone()
                
                if not item or item['user_id'] != user_id:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Forbidden'}),
                        'isBase64Encoded': False
                    }
                
                update_fields = []
                params = []
                
                if 'isActive' in data:
                    update_fields.append('is_active = %s')
                    params.append(data['isActive'])
                
                if 'title' in data:
                    update_fields.append('title = %s')
                    params.append(data['title'])
                
                if 'price' in data:
                    update_fields.append('price = %s')
                    params.append(data['price'])
                
                if update_fields:
                    update_fields.append('updated_at = %s')
                    params.append(datetime.utcnow())
                    params.append(item_id)
                    
                    query = f"UPDATE catalog_items SET {', '.join(update_fields)} WHERE id = %s"
                    cur.execute(query, params)
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 405,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Method not allowed'}),
                    'isBase64Encoded': False
                }
        
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }