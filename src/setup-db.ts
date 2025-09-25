import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { Sequelize } from "sequelize-typescript";

const logger = new Logger("DatabaseSetup");

async function setupDatabase() {
  let app;

  try {
    logger.log("🔧 Starting database setup...");

    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ["log", "error", "warn"],
    });

    const sequelize = app.get("SEQUELIZE") as Sequelize;

    if (!sequelize) {
      throw new Error("Failed to get Sequelize instance");
    }

    logger.log("🔄 Synchronizing database tables...");

    // Create tables without seeding data
    await sequelize.sync({ alter: true });
    logger.log("✅ Database tables created successfully!");

    // Test the connection
    await sequelize.authenticate();
    logger.log("🔌 Database connection verified!");

    // Get table information
    const tables = await sequelize.getQueryInterface().showAllTables();
    logger.log(
      `📊 Created/updated ${tables.length} tables: ${tables.join(", ")}`
    );
  } catch (error) {
    logger.error("❌ Error setting up database:", error.message);
    logger.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    if (app) {
      try {
        await app.close();
        logger.log("🔚 Application context closed successfully");
      } catch (closeError) {
        logger.error("Error closing application context:", closeError.message);
      }
    }
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception in database setup:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    "Unhandled Rejection in database setup at:",
    promise,
    "reason:",
    reason
  );
  process.exit(1);
});

setupDatabase();
