#!/bin/bash

# BON Rewards API Test Script
# Make sure the server is running before executing this script

BASE_URL="http://localhost:3000/api"

echo "🧪 Testing BON Rewards API"
echo "=========================="

# Test 1: Create a user
echo "1. Creating a test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "creditCardNumber": "**** **** **** 1111"
  }')

USER_ID=$(echo $USER_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "✅ Created user with ID: $USER_ID"

# Test 2: Create bills
echo "2. Creating bills for the user..."
BILL1_RESPONSE=$(curl -s -X POST $BASE_URL/bills \
  -H "Content-Type: application/json" \
  -d '{
    "userId": '$USER_ID',
    "amount": 100.00,
    "dueDate": "2024-01-15T00:00:00.000Z",
    "description": "January Bill"
  }')

BILL2_RESPONSE=$(curl -s -X POST $BASE_URL/bills \
  -H "Content-Type: application/json" \
  -d '{
    "userId": '$USER_ID',
    "amount": 150.00,
    "dueDate": "2024-02-15T00:00:00.000Z",
    "description": "February Bill"
  }')

BILL3_RESPONSE=$(curl -s -X POST $BASE_URL/bills \
  -H "Content-Type: application/json" \
  -d '{
    "userId": '$USER_ID',
    "amount": 200.00,
    "dueDate": "2024-03-15T00:00:00.000Z",
    "description": "March Bill"
  }')

BILL1_ID=$(echo $BILL1_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
BILL2_ID=$(echo $BILL2_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
BILL3_ID=$(echo $BILL3_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✅ Created 3 bills with IDs: $BILL1_ID, $BILL2_ID, $BILL3_ID"

# Test 3: Pay bills on time (should trigger reward on 3rd payment)
echo "3. Paying bills on time..."

echo "   Paying bill 1..."
curl -s -X PATCH $BASE_URL/bills/$BILL1_ID/pay \
  -H "Content-Type: application/json" \
  -d '{"paidDate": "2024-01-10T00:00:00.000Z"}' > /dev/null

echo "   Paying bill 2..."
curl -s -X PATCH $BASE_URL/bills/$BILL2_ID/pay \
  -H "Content-Type: application/json" \
  -d '{"paidDate": "2024-02-10T00:00:00.000Z"}' > /dev/null

echo "   Paying bill 3 (should trigger reward)..."
REWARD_RESPONSE=$(curl -s -X PATCH $BASE_URL/bills/$BILL3_ID/pay \
  -H "Content-Type: application/json" \
  -d '{"paidDate": "2024-03-10T00:00:00.000Z"}')

echo "✅ Payment response:"
echo $REWARD_RESPONSE | jq '.' 2>/dev/null || echo $REWARD_RESPONSE

# Test 4: Check user's rewards
echo "4. Checking user's rewards..."
REWARDS_RESPONSE=$(curl -s $BASE_URL/users/$USER_ID/rewards)
echo "✅ User's rewards:"
echo $REWARDS_RESPONSE | jq '.' 2>/dev/null || echo $REWARDS_RESPONSE

# Test 5: Check user's total reward value
echo "5. Checking total reward value..."
TOTAL_VALUE_RESPONSE=$(curl -s $BASE_URL/users/$USER_ID/rewards/total-value)
echo "✅ Total reward value:"
echo $TOTAL_VALUE_RESPONSE | jq '.' 2>/dev/null || echo $TOTAL_VALUE_RESPONSE

echo ""
echo "🎉 API test completed!"
echo "If you see a reward in the responses above, the system is working correctly!"
