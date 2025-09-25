# BON Rewards Backend System

A NestJS backend system that simulates BON's gift card rewards for users who consistently pay their credit card bills on time.

## Features

- **User Management**: Create and manage users with credit card information
- **Bill Tracking**: Track bills with due dates and payment dates
- **Reward System**: Automatically generate rewards when users pay their last 3 bills on time
- **Gift Card Types**: Amazon, Starbucks, Target gift cards, and cash back rewards
- **Payment History**: Track on-time vs late payments

## Prerequisites

- Node.js (v18.x or higher - tested with v18.19.1)
- PostgreSQL database
- npm or yarn

**Note**: This project uses NestJS v10 which is compatible with Node.js 18+. If you encounter syntax errors related to `??=` operators, ensure you're using Node.js 18 or higher.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your PostgreSQL database and update the configuration in `config.ts`:

```typescript
export const config = {
  database: {
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "your_password",
    database: "bon_rewards",
  },
  port: 3000,
};
```

3. Build the application:

```bash
npm run build
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## Netlify Deployment

This application can be deployed to Netlify as serverless functions. See [`NETLIFY_DEPLOYMENT.md`](NETLIFY_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Netlify

1. **Build for Netlify:**

   ```bash
   npm run build:netlify
   ```

2. **Set up a cloud database** (required for Netlify deployment)
3. **Deploy to Netlify** using GitHub integration or manual upload
4. **Configure environment variables** in Netlify dashboard

Your API will be available at: `https://your-site-name.netlify.app/api`

## Database Setup

### Just create tables (no seed data)

```bash
npm run db:setup
```

## Database Seeding

To populate the database with mock data for testing:

### Option 1: Create tables and seed data (safe for existing data)

```bash
npm run seed
```

### Option 2: Fresh start - drop all tables and recreate with seed data

```bash
npm run seed:fresh
```

**Note**: The seed script will automatically:

- Create database tables if they don't exist
- Use `seed:fresh` for a complete reset (drops existing data)
- Use `seed` for adding data to existing tables

This will create:

- 2 test users (Alice and Bob)
- Multiple bills for each user
- Alice will have 3 on-time payments (triggering a reward)
- Bob will have mixed payment history (no reward)

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/rewards` - Get user's rewards
- `GET /api/users/:id/rewards/unredeemed` - Get unredeemed rewards
- `GET /api/users/:id/rewards/total-value` - Get total reward value

### Bills

- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create a new bill
- `GET /api/bills/user/:userId` - Get bills for a user
- `GET /api/bills/user/:userId/unpaid` - Get unpaid bills
- `GET /api/bills/user/:userId/recent` - Get recent paid bills
- `PATCH /api/bills/:id/pay` - Pay a bill (triggers reward check)

### Rewards

- `GET /api/rewards` - Get all rewards
- `GET /api/rewards/user/:userId` - Get rewards for a user
- `POST /api/rewards/generate/:userId` - Manually generate a reward
- `PATCH /api/rewards/:id/redeem` - Redeem a reward

## Testing the Reward System

1. **Create a user:**

```bash
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "creditCardNumber": "**** **** **** 9999"
  }'
```

2. **Create bills for the user:**

```bash
curl -X POST http://localhost:3000/api/bills \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": 1,
    "amount": 150.00,
    "dueDate": "2024-01-15T00:00:00.000Z",
    "description": "Test Bill"
  }'
```

3. **Pay bills on time (3 consecutive on-time payments trigger a reward):**

```bash
curl -X PATCH http://localhost:3000/api/bills/1/pay \\
  -H "Content-Type: application/json" \\
  -d '{
    "paidDate": "2024-01-10T00:00:00.000Z"
  }'
```

## Reward Logic

- Users earn rewards when they pay their **last 3 bills on time**
- A bill is considered "on time" if paid on or before the due date
- Rewards are randomly selected from:
  - $10 Amazon Gift Card
  - $5 Starbucks Gift Card
  - $15 Target Gift Card
  - $5 Cash Back
- Each reward includes a mock gift card code

## Project Structure

```
src/
├── controllers/          # API route handlers
├── services/            # Business logic
├── models/              # Sequelize models and repositories
├── database/            # Database configuration
├── main.ts              # Application entry point
└── seed.ts              # Database seeding script
```

## Technologies Used

- **NestJS** - Node.js framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Class Validator** - Request validation

## Development Notes

The system uses mock data and simulated gift card codes. In a production environment, you would integrate with actual gift card providers and payment systems.
