import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { configure } from "@vendia/serverless-express";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config();

// Import the AppModule - this will be resolved at build time
import { AppModule } from "../../dist/src/app.module";

let cachedApp: any;

const createApp = async (): Promise<express.Application> => {
  console.log("🚀 Starting app creation...");

  // Log environment variables for debugging
  console.log("📋 Environment Variables Check:");
  console.log(
    `- NETLIFY_DATABASE_URL: ${
      process.env.NETLIFY_DATABASE_URL ? "✅ Set" : "❌ Not set"
    }`
  );
  console.log(
    `- DATABASE_URL: ${process.env.DATABASE_URL ? "✅ Set" : "❌ Not set"}`
  );
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || "not set"}`);

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  console.log("🏗️ Creating NestJS application...");
  const app = await NestFactory.create(AppModule, adapter, {
    logger: ["error", "warn", "log", "debug"],
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix("api");

  console.log("🔧 Initializing application...");
  await app.init();

  console.log("✅ App created successfully");
  return expressApp;
};

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  console.log(`🌐 Incoming request: ${event.httpMethod} ${event.path}`);

  // Set context to not wait for empty event loop
  context.callbackWaitsForEmptyEventLoop = false;

  // Cache the app instance to improve cold start performance
  if (!cachedApp) {
    try {
      console.log("❄️ Cold start - creating new app instance");
      const app = await createApp();
      cachedApp = configure({
        app,
      });
      console.log("🔥 App instance cached successfully");
    } catch (error) {
      console.error("💥 Failed to create app:", error);
      console.error("Stack trace:", error.stack);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to initialize application",
          details: error.message,
          timestamp: new Date().toISOString(),
        }),
      };
    }
  } else {
    console.log("♻️ Using cached app instance");
  }

  try {
    console.log("📤 Processing request...");
    const result = await cachedApp(event, context);
    console.log("✅ Request processed successfully");
    return result;
  } catch (error) {
    console.error("💥 Handler error:", error);
    console.error("Stack trace:", error.stack);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
