import json
import boto3
from decimal import Decimal

# Common CORS headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',  # or replace '*' with the specific frontend domain for security
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,GET'
}

def lambda_handler(event, context):
    try:
        # Handle preflight OPTIONS request
        if event.get("httpMethod") == "OPTIONS":
            return {
                'statusCode': 200,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": "CORS preflight OK" })
            }

        # DynamoDB client setup
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('BloodStock')  # Your correct table name

        # Scan the table for all blood stock data
        response = table.scan()
        items = response.get('Items', [])

        # Convert Decimal to int or float for JSON serialization
        def decimal_default(obj):
            if isinstance(obj, Decimal):
                return float(obj)
            raise TypeError("Type not serializable")

        return {
            'statusCode': 200,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(items, default=decimal_default)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({'error': str(e)})
        }
