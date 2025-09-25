import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../src/app.module";
import { INestApplication } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { configure } from "@vendia/serverless-express";

let cachedApp: any;

const createApp = async (): Promise<express.Application> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);

  const app = await NestFactory.create(AppModule, adapter, {
    logger: ["error", "warn", "log"],
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix("api");

  await app.init();
  return expressApp;
};

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Cache the app instance to improve cold start performance
  if (!cachedApp) {
    try {
      const app = await createApp();
      cachedApp = configure({
        app,
      });
    } catch (error) {
      console.error("Failed to create app:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to initialize application",
        }),
      };
    }
  }

  try {
    return await cachedApp(event, context);
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    };
  }
};
