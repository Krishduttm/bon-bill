"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("../config");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const logger = new common_1.Logger("Bootstrap");
async function bootstrap() {
    try {
        logger.log("Starting BON Rewards application...");
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ["log", "error", "warn", "debug", "verbose"],
        });
        app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter(), new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: false,
            validationError: {
                target: false,
                value: false,
            },
        }));
        app.enableCors({
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        });
        app.setGlobalPrefix("api");
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
        await app.listen(config_1.config.port);
        logger.log(`🚀 BON Rewards API is running on: http://localhost:${config_1.config.port}/api`);
        logger.log(`📊 Database connected to: ${config_1.config.database.host}:${config_1.config.database.port}/${config_1.config.database.database}`);
        logger.log("✅ Application started successfully");
    }
    catch (error) {
        logger.error("❌ Failed to start application", error.stack);
        process.exit(1);
    }
}
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
bootstrap();
//# sourceMappingURL=main.js.map