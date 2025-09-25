# Bill Management API

A NestJS-based API for managing bills and user payments with reward system for consecutive on-time payments.

## API Endpoints

### Create User

Create a new user in the system.

```bash
curl --location 'https://bon-bill.onrender.com/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}'
```

### Create Bill

Create a new bill for a user.

```bash
curl --location 'https://bon-bill.onrender.com/api/bills' \
--header 'Content-Type: application/json' \
--data '{
  "userId": 2,
  "amount": 150.50,
  "dueDate": "2026-10-15T00:00:00.000Z",
  "description": "Electric Bill - October 2024"
}'
```

### Pay Bill

Mark a bill as paid. The system automatically checks for consecutive on-time payments and awards rewards.

```bash
curl --location --request PATCH 'https://bon-bill.onrender.com/api/bills/6/pay'
```
