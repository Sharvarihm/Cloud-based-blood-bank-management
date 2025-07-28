# Blood Bank Management System (Serverless – AWS)

This is a cloud-native Blood Bank Management System built using serverless AWS services. It manages donor registrations, real-time blood stock, and hospital blood requests. The frontend is built using React and Tailwind CSS, and hosted on Amazon S3.

---

## Project Overview

The system enables:

* Donors to register and offer blood donations
* Hospitals to request blood units and view matching donors
* Automatic stock updates and validations

The backend is deployed entirely on AWS using Lambda, API Gateway, and DynamoDB.

---

## System Architecture




---

## Technologies Used

### Backend (AWS)

* AWS Lambda (5 serverless functions)
* Amazon API Gateway
* Amazon DynamoDB (3 tables)
* Amazon S3 (for frontend deployment)

### Frontend

* React.js
* Tailwind CSS
* Deployed to S3 (static website hosting)

---

## AWS Components

### Lambda Functions

| Function Name    | Description                        |
| ---------------- | ---------------------------------- |
| `register_donor` | Stores new donor details           |
| `request_blood`  | Handles hospital blood requests    |
| `validate_stock` | Checks blood availability          |
| `get_donors`     | Lists donors based on blood group  |
| `update_stock`   | Updates blood stock after donation |

---

### API Endpoints (API Gateway)

| Endpoint          | Method | Description                    |
| ----------------- | ------ | ------------------------------ |
| `/register-donor` | POST   | Register a new donor           |
| `/request-blood`  | POST   | Hospital requests blood        |
| `/view-stock`     | GET    | Check blood stock availability |
| `/list-donors`    | GET    | Get matching donors            |
| `/contact-donor`  | POST   | Contact the donors             |

---

### DynamoDB Tables

| Table Name         | Partition Key | Description                     |
| ------------------ | ------------- | ------------------------------- |
| `BloodStock`       | blood\_type   | Tracks available blood units    |
| `Donors`           | donor\_id     | Stores donor information        |
| `HospitalRequests` | request\_id   | Records hospital blood requests |

---

### S3 Bucket – Frontend Hosting

* **Bucket Name**: `blood-frontend`
* **Frontend**: Built using React and Tailwind
* **Deployment**: `npm run build` → uploaded to S3
* **Static Website Hosting**: Enabled
* **Public Access**: Enabled (read-only)


## Screenshots

### Home Page
<img width="1280" height="649" alt="image" src="https://github.com/user-attachments/assets/30ea06bc-7941-4bdd-9e7d-1b946f4b04b7" />

### Donor Registration 

<img width="1280" height="645" alt="image" src="https://github.com/user-attachments/assets/6664ec70-9e8d-474b-9c46-ceb718ec372e" />

### Blood stock availability

<img width="1280" height="676" alt="image" src="https://github.com/user-attachments/assets/e678284b-d10b-4844-b707-f46b82adf289" />

###  Hospital Blood Request 

<img width="1280" height="616" alt="image" src="https://github.com/user-attachments/assets/068c1487-cc12-4785-a5a9-0d1f1ef9fc1e" />

### Matching donors for request
<img width="1280" height="614" alt="image" src="https://github.com/user-attachments/assets/f93edfc1-b4a3-4d5f-b30a-91c5ceb6df09" />

###Donors notified through SMS
<img width="1280" height="769" alt="image" src="https://github.com/user-attachments/assets/25c00fbd-5572-4eb4-9802-bdd74f3f9599" />

---

## Project Structure

```
blood-bank-project/
├── backend/
│   ├── lambda_functions/
│   ├── dynamodb_schema.md
│   ├── api_endpoints.md
│   ├── s3_bucket_structure.md
│   └── architecture.png
├── frontend/        (React build output)
├── screenshots/     (Optional screenshots/images)
└── README.md
```

---

## Deployment Steps

1. Set up your Lambda functions on AWS Lambda.
2. Create and configure your API Gateway with the 5 routes.
3. Set up your 3 DynamoDB tables as defined.
4. Build your frontend:

   ```bash
   npm run build
   ```
5. Upload the contents of the `build/` folder to the S3 bucket `blood-frontend`.
6. Enable static website hosting and public access in S3.
7. Test all routes and integration.

---

## Future Improvements

* Add user authentication using AWS Cognito
* Enable email notifications via Amazon SES
* Integrate monitoring with CloudWatch
* Add admin dashboard with analytics

---

## License

This project is open for academic, demo, and extension use. You may fork and modify with credit.

