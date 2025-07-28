import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
donor_table = dynamodb.Table('Donors')         # Donors table
stock_table = dynamodb.Table('BloodStock')     # Blood stock table

# Common CORS headers
#origin = event['headers'].get('origin', '*')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',  
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
}

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))

        # Handle preflight OPTIONS request
        if event.get("httpMethod") == "OPTIONS":
            return {
                'statusCode': 200,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": "CORS preflight OK" })
            }

        # Extract body from event
        body = json.loads(event.get('body', '{}'))
        print("Parsed body:", body)

        # Extract donor details
        donor_id = body.get('donor_id')
        name = body.get('name')
        contact = body.get('contact')
        age = body.get('age')
        blood_type = body.get('blood_type')
        consent = body.get('consent')

        # Validate fields
        if not all([donor_id, name, contact, age, blood_type, consent]):
            return {
                'statusCode': 400,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": "❗ Missing required donor fields." })
            }

        # Prepare donor item
        donor_item = {
            'donor_id': donor_id,
            'name': name,
            'contact': contact,
            'age': int(age),
            'blood_type': blood_type,
            'consent': consent
        }

        # Put item in Donors table
        donor_table.put_item(Item=donor_item)


         # Update BloodStock table
        try:
            # Check if the blood type already exists
            stock_response = stock_table.get_item(Key={'blood_type': blood_type})

            if 'Item' in stock_response:
                # If blood type exists, update the quantity available
                stock_table.update_item(
                    Key={'blood_type': blood_type},
                    UpdateExpression='SET quantity_available = quantity_available + :inc',
                    ExpressionAttributeValues={':inc': 1}
                )
            else:
                # If blood type doesn't exist, add it with initial quantity of 1
                stock_table.put_item(Item={'blood_type': blood_type, 'quantity_available': 1})

        except ClientError as e:
            return {
                'statusCode': 500,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps({ "message": f"❌ Error updating stock: {str(e)}" })
            }

        

        return {
            'statusCode': 200,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json', },
            'body': json.dumps({ "message": f"✅ Donor {donor_id} registered successfully. Stock updated for {blood_type}." })
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"❌ Error registering donor: {str(e)}" })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({ "message": f"❌ Unexpected error: {str(e)}" })
        }
