import json
import boto3
import uuid
import time
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
requests_table = dynamodb.Table('HospitalRequests')
stock_table = dynamodb.Table('BloodStock')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

def lambda_handler(event, context):
    try:
        if event.get("httpMethod") == "OPTIONS":
            return {
                'statusCode': 200,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": "CORS preflight OK" })
            }

        body = json.loads(event['body'])

        request_id = str(uuid.uuid4())
        hospital_name = body['hospital_name']
        blood_type = body['blood_type']
        units_required = int(body['units_required'])

        stock_response = stock_table.get_item(Key={'blood_type': blood_type})

        if 'Item' not in stock_response:
            return {
                'statusCode': 404,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": f"No stock info found for blood type {blood_type}." })
            }

        # Save the request (without modifying stock)
        requests_table.put_item(Item={
            'request_id': request_id,
            'hospital_name': hospital_name,
            'blood_type': blood_type,
            'units_required': units_required,
            'timestamp': int(time.time())
        })

        return {
            'statusCode': 200,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"Request {request_id} submitted successfully." })
        }

    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"Missing required field: {str(e)}" })
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"AWS Client error: {str(e)}" })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"Unexpected error: {str(e)}" })
        }
