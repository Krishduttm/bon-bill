# Netlify Deployment Guide

This guide will help you deploy the BON Rewards Backend System to Netlify as serverless functions.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Cloud Database**: You'll need a cloud PostgreSQL database since Netlify doesn't support local databases
3. **GitHub Repository**: Your code should be in a GitHub repository

## Recommended Database Providers

Since Netlify is serverless, you'll need a cloud database. Here are some recommended options:

### 1. Supabase (Recommended)

- **Website**: [supabase.com](https://supabase.com/)
- **Free tier**: Yes, with generous limits
- **Setup**:
  1. Create a new project
  2. Get connection details from Settings > Database
  3. Use the connection pooler URL for better performance

### 2. Neon

- **Website**: [neon.tech](https://neon.tech/)
- **Free tier**: Yes
- **Features**: Serverless PostgreSQL with branching

### 3. Railway

- **Website**: [railway.app](https://railway.app/)
- **Free tier**: Limited
- **Features**: Simple deployment and database hosting

## Deployment Steps

### 1. Install Dependencies

First, install the new Netlify-specific dependencies:

```bash
npm install
```

### 2. Set Up Your Cloud Database

1. Choose a database provider (Supabase recommended)
2. Create a new PostgreSQL database
3. Note down the connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

### 3. Connect to Netlify

#### Option A: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and log in
3. Click "New site from Git"
4. Connect your GitHub account
5. Select your repository
6. Configure build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

#### Option B: Manual Deploy

1. Build your project locally:
   ```bash
   npm run build:netlify
   ```
2. Drag and drop the `dist` folder to Netlify

### 4. Configure Environment Variables

In your Netlify site dashboard:

1. Go to **Site settings** > **Environment variables**
2. Add the following variables with your database details:

```
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=bon_rewards
NODE_ENV=production
```

### 5. Deploy and Test

1. Trigger a new deployment (if using GitHub integration, push to your repository)
2. Once deployed, your API will be available at:
   ```
   https://your-site-name.netlify.app/api
   ```

### 6. Initialize Your Database

After deployment, you'll need to set up your database tables. You have a few options:

#### Option A: Use a Database Migration Tool

Run your database setup script against your cloud database:

```bash
# Update your local config to point to the cloud database
# Then run:
npm run db:setup
```

#### Option B: Manual SQL Setup

Connect to your cloud database and run the SQL commands to create the tables manually.

## API Endpoints

Once deployed, your API endpoints will be:

- `GET https://your-site-name.netlify.app/api/users` - Get all users
- `POST https://your-site-name.netlify.app/api/users` - Create a user
- `GET https://your-site-name.netlify.app/api/bills` - Get all bills
- `POST https://your-site-name.netlify.app/api/bills` - Create a bill
- `PATCH https://your-site-name.netlify.app/api/bills/:id/pay` - Pay a bill
- `GET https://your-site-name.netlify.app/api/rewards` - Get all rewards

## Troubleshooting

### Cold Starts

Serverless functions have cold start delays. The first request after inactivity may take 5-10 seconds.

### Database Connections

If you get connection errors:

1. Check your environment variables
2. Ensure your database allows connections from external IPs
3. Use connection pooling if available

### Build Errors

If the build fails:

1. Check the build logs in Netlify
2. Ensure all dependencies are in the `dependencies` section (not `devDependencies`)
3. Verify TypeScript compilation works locally

### Function Timeout

Netlify functions have a 10-second timeout on the free tier. For database-heavy operations, consider:

1. Optimizing queries
2. Using database indexes
3. Upgrading to a paid plan (26-second timeout)

## Local Development

To test the Netlify functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

This will run your functions locally at `http://localhost:8888`

## Performance Tips

1. **Database Connection Pooling**: Use connection pooling in your cloud database
2. **Caching**: Implement caching for frequently accessed data
3. **Optimization**: Keep functions lightweight and optimize cold start times
4. **Monitoring**: Use Netlify's function logs to monitor performance

## Cost Considerations

- **Netlify**: Free tier includes 125K function invocations/month
- **Database**: Most providers offer free tiers suitable for development
- **Scaling**: Monitor usage and upgrade plans as needed

## Security

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database Security**: Use strong passwords and enable SSL connections
3. **API Rate Limiting**: Consider implementing rate limiting for production use
4. **CORS**: Configure CORS appropriately for your frontend domain

## Support

If you encounter issues:

1. Check Netlify's function logs
2. Review the database connection logs
3. Test API endpoints using tools like Postman or curl
4. Refer to Netlify's documentation for serverless functions
