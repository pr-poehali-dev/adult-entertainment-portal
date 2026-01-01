import json
import os
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_user_id_from_token(headers: dict) -> int:
    """Извлечение user_id из токена (упрощенная версия)"""
    auth_header = headers.get('x-authorization', headers.get('X-Authorization', ''))
    if not auth_header:
        return None
    token = auth_header.replace('Bearer ', '')
    return int(token.split(':')[0]) if ':' in token else None

def handler(event: dict, context) -> dict:
    """API для управления бизнес-услугами"""
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
                status = query_params.get('status', 'active')
                
                cur.execute("""
                    SELECT 
                        s.id, s.user_id, s.category_id, s.title, s.description,
                        s.status, s.images, s.created_at, s.published_at,
                        u.username as owner_name, u.business_type,
                        COALESCE(
                            json_agg(
                                json_build_object(
                                    'id', p.id,
                                    'name', p.name,
                                    'description', p.description,
                                    'unit', p.unit,
                                    'price', p.price,
                                    'currency', p.currency
                                ) ORDER BY p.price
                            ) FILTER (WHERE p.id IS NOT NULL),
                            '[]'
                        ) as programs
                    FROM business_services s
                    LEFT JOIN users u ON s.user_id = u.id
                    LEFT JOIN service_programs p ON s.id = p.service_id
                    WHERE s.status = %s
                    GROUP BY s.id, u.username, u.business_type
                    ORDER BY s.created_at DESC
                """, (status,))
                
                services = cur.fetchall()
                
                result = []
                for service in services:
                    result.append({
                        'id': service['id'],
                        'userId': service['user_id'],
                        'categoryId': service['category_id'],
                        'title': service['title'],
                        'description': service['description'],
                        'status': service['status'],
                        'images': service['images'] or [],
                        'ownerName': service['owner_name'],
                        'businessType': service['business_type'],
                        'programs': service['programs'],
                        'createdAt': service['created_at'].isoformat() if service['created_at'] else None,
                        'publishedAt': service['published_at'].isoformat() if service['published_at'] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'services': result}),
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
                
                title = data.get('title')
                description = data.get('description')
                category_id = data.get('categoryId')
                images = data.get('images', [])
                programs = data.get('programs', [])
                
                if not title:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Title is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("""
                    INSERT INTO business_services (
                        user_id, category_id, title, description, 
                        status, images, published_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    user_id, category_id, title, description,
                    'active', images, datetime.utcnow()
                ))
                
                service_id = cur.fetchone()['id']
                
                for program in programs:
                    cur.execute("""
                        INSERT INTO service_programs (
                            service_id, name, description, unit, price, currency
                        ) VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        service_id,
                        program.get('name'),
                        program.get('description'),
                        program.get('unit'),
                        program.get('price'),
                        program.get('currency', 'RUB')
                    ))
                
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'serviceId': service_id}),
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
                service_id = data.get('serviceId')
                
                if not service_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Service ID is required'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT user_id FROM business_services WHERE id = %s", (service_id,))
                service = cur.fetchone()
                
                if not service or service['user_id'] != user_id:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Forbidden'}),
                        'isBase64Encoded': False
                    }
                
                status = data.get('status')
                if status:
                    cur.execute("""
                        UPDATE business_services 
                        SET status = %s, updated_at = %s
                        WHERE id = %s
                    """, (status, datetime.utcnow(), service_id))
                
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