import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import { User } from "../models/user.model";
import { Bill } from "../models/bill.model";
import { Reward } from "../models/reward.model";

const logger = new Logger("DatabaseProvider");

// Parse database URL for Netlify deployment
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

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async (): Promise<Sequelize> => {
      try {
        logger.log("Initializing database connection...");

        // Priority: NETLIFY_DATABASE_URL > DATABASE_URL > individual env vars > defaults
        const netlifyDbUrl = process.env.NETLIFY_DATABASE_URL;
        const databaseUrl = process.env.DATABASE_URL;

        // Debug logging for environment variables
        logger.debug(`Environment check:`);
        logger.debug(
          `- NETLIFY_DATABASE_URL: ${netlifyDbUrl ? "✅ Set" : "❌ Not set"}`
        );
        logger.debug(
          `- DATABASE_URL: ${databaseUrl ? "✅ Set" : "❌ Not set"}`
        );
        logger.debug(
          `- DATABASE_HOST: ${
            process.env.DATABASE_HOST ? "✅ Set" : "❌ Not set"
          }`
        );

        let dbConfig;

        if (netlifyDbUrl) {
          logger.log("Using NETLIFY_DATABASE_URL for database connection");
          dbConfig = parseDatabaseUrl(netlifyDbUrl);
        } else if (databaseUrl) {
          logger.log("Using DATABASE_URL for database connection");
          dbConfig = parseDatabaseUrl(databaseUrl);
        } else {
          logger.log(
            "Using individual environment variables for database connection"
          );
          dbConfig = {
            host:
              process.env.DATABASE_HOST || process.env.DB_HOST || "localhost",
            port:
              parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) ||
              5432,
            username:
              process.env.DATABASE_USERNAME ||
              process.env.DB_USERNAME ||
              "postgres",
            password:
              process.env.DATABASE_PASSWORD ||
              process.env.DB_PASSWORD ||
              "password",
            database:
              process.env.DATABASE_NAME || process.env.DB_NAME || "bon_rewards",
          };
        }

        logger.log(
          `Connecting to database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
        );

        const sequelize = new Sequelize({
          dialect: "postgres",
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          logging: (msg) => logger.debug(msg),
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
          retry: {
            match: [
              /ConnectionError/,
              /ConnectionRefusedError/,
              /ConnectionTimedOutError/,
              /TimeoutError/,
            ],
            max: 3,
          },
          dialectOptions: {
            ssl:
              netlifyDbUrl || databaseUrl
                ? {
                    require: true,
                    rejectUnauthorized: false,
                  }
                : false,
          },
        });

        // Test the connection
        await sequelize.authenticate();
        logger.log("✅ Database connection established successfully");

        // Add models
        sequelize.addModels([User, Bill, Reward]);
        logger.log("📋 Database models loaded");

        // Sync models with alter: true for production safety
        await sequelize.sync({ alter: true });
        logger.log("🔄 Database models synchronized");

        return sequelize;
      } catch (error) {
        logger.error(
          "❌ Failed to initialize database connection",
          error.stack
        );
        throw error;
      }
    },
  },
];
