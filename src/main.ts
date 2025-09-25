// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { AppModule } from "./app.module";
import { config } from "../config";
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
} from "./filters/http-exception.filter";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  try {
    logger.log("Starting BON Rewards application...");

    const app = await NestFactory.create(AppModule, {
      logger: ["log", "error", "warn", "debug", "verbose"],
    });

    // Enable global exception filters
    app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

    // Enable validation with detailed error messages
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
        validationError: {
          target: false,
          value: false,
        },
      })
    );

    // Enable CORS with proper configuration
    app.enableCors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // Global prefix
    app.setGlobalPrefix("api");

    // Graceful shutdown handling
    process.on("SIGTERM", async () => {
      logger.log("SIGTERM received, shutting down gracefully...");
      await app.close();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      logger.log("SIGINT received, shutting down gracefully...");
      await app.close();
      process.exit(0);
    });

    // Start the server
    await app.listen(config.port);

    logger.log(
      `🚀 BON Rewards API is running on: http://localhost:${config.port}/api`
    );
    logger.log(
      `📊 Database connected to: ${config.database.host}:${config.database.port}/${config.database.database}`
    );
    logger.log("✅ Application started successfully");
  } catch (error) {
    logger.error("❌ Failed to start application", error.stack);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

bootstrap();
