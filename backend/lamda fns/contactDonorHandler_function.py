import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB and SNS clients
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')  # To send notifications (e.g., SMS)
donors_table = dynamodb.Table('Donors')  # Table containing donor info
stock_table = dynamodb.Table('BloodStock')  # Table containing blood stock information

# CORS headers
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
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

        # Parse the request body
        body = json.loads(event['body'])

        donor_id = body['donor_id']
        blood_type = body['blood_type']

        # Retrieve donor details
        donor_response = donors_table.get_item(Key={'donor_id': donor_id})
        if 'Item' not in donor_response:
            return {
                'statusCode': 404,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps(f"Donor with ID {donor_id} not found.")
            }

        donor = donor_response['Item']
        phone_number = donor.get('contact')

        # Display message if phone number exists (simulate SMS being sent for now)
        if phone_number:
            # Normally, SNS would send the SMS here
            message = f"Hello {donor['name']}, you have been contacted for a blood donation. Blood Type: {blood_type}. Please respond."
            # For now, just simulate the sending
            print(f"Sending SMS to {phone_number}: {message}")
            # Uncomment below for actual SNS integration when you're ready
            # sns.publish(
            #     PhoneNumber=phone_number,
            #     Message=message
            # )
            sms_status = f"SMS is being sent to {donor['name']} at {phone_number}."  # Simulate SMS status

        else:
            sms_status = "No phone number found for the donor."

        # Update blood stock
        stock_response = stock_table.get_item(Key={'blood_type': blood_type})
        if 'Item' not in stock_response:
            return {
                'statusCode': 404,
                'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
                'body': json.dumps(f"No stock info found for blood type {blood_type}.")
            }

        available_units = int(stock_response['Item']['quantity_available'])
        new_units = available_units - 1
        stock_table.update_item(
            Key={'blood_type': blood_type},
            UpdateExpression='SET quantity_available = :val',
            ExpressionAttributeValues={':val': new_units}
        )

        # Respond with a message confirming SMS and stock update
        return {
            'statusCode': 200,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps({
                "message": f"Notification simulated for {donor['name']}. Stock updated for {blood_type}.",
                "sms_status": sms_status
            })
        }

    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(f"Missing required field: {str(e)}")
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(f"AWS Client error: {str(e)}")
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': { **CORS_HEADERS, 'Content-Type': 'application/json' },
            'body': json.dumps(f"Unexpected error: {str(e)}")
        }
