# Render Environment Variables

Copy these environment variables to your Render service:

## Required Variables

```bash
# Database Configuration (Render will provide this automatically if you use Render PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Application Configuration
NODE_ENV=production
PORT=10000
```

## Optional Variables

```bash
# CORS Configuration
CORS_ORIGIN=*

# Alternative: Individual Database Variables (if not using DATABASE_URL)
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=bon_rewards
```

## If Using Your Existing Neon Database

Just set:
```bash
DATABASE_URL=your-existing-netlify-database-url-here
```
