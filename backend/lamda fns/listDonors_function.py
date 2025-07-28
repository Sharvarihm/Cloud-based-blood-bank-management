import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
donor_table = dynamodb.Table('Donors')  # Your donor table name

# CORS headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',  # Change '*' to your domain for security if needed
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

def lambda_handler(event, context):
    try:
        # Handle CORS preflight
        if event.get("httpMethod") == "OPTIONS":
            return {
                'statusCode': 200,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": "CORS preflight OK" })
            }

        # ✅ Get blood_type from query string
        requested_blood_type = event.get('queryStringParameters', {}).get('blood_type')
        print("Requested blood type:", requested_blood_type)

        if not requested_blood_type:
            return {
                'statusCode': 400,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps("Query parameter 'blood_type' is required.")
            }

        # 🔍 Debug: Print all donor items for verification
        all_items = donor_table.scan()
        print("All donors in table:", all_items.get('Items', []))

        # 🧪 Filter donors by blood_type
        response = donor_table.scan(
            FilterExpression='blood_type = :blood_type',
            ExpressionAttributeValues={':blood_type': requested_blood_type}
        )
        print("Filtered DynamoDB response:", response)

        donors = response.get('Items', [])

        if not donors:
            return {
                'statusCode': 404,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps(f"No donors found with blood type {requested_blood_type}.")
            }

        # Convert Decimal fields (if any) to float for JSON serialization
        def decimal_to_float(obj):
            if isinstance(obj, Decimal):
                return float(obj)
            raise TypeError("Type not serializable")

        donors_serialized = json.loads(json.dumps(donors, default=decimal_to_float))

        return {
            'statusCode': 200,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "donors": donors_serialized })
        }

    except ClientError as e:
        print("AWS Client Error:", str(e))
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(f"AWS Client error: {str(e)}")
        }

    except Exception as e:
        print("Unexpected Error:", str(e))
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(f"Unexpected error: {str(e)}")
        }
