// Parse DATABASE_URL if provided (for services like Neon, Heroku, etc.)
const parseDatabaseUrl = (url: string) => {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port) || 5432,
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1), // Remove leading slash
  };
};

const databaseUrl = process.env.DATABASE_URL;
const parsedUrl = databaseUrl ? parseDatabaseUrl(databaseUrl) : null;

export const config = {
  database: {
    host: process.env.DATABASE_HOST || process.env.DB_HOST || parsedUrl?.host || "localhost",
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) || parsedUrl?.port || 5432,
    username: process.env.DATABASE_USERNAME || process.env.DB_USERNAME || parsedUrl?.username || "postgres",
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || parsedUrl?.password || "password",
    database: process.env.DATABASE_NAME || process.env.DB_NAME || parsedUrl?.database || "bon_rewards",
  },
  port: parseInt(process.env.PORT) || 3000,
};
