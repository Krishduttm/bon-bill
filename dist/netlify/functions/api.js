"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../src/app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const serverless_express_1 = require("@vendia/serverless-express");
let cachedApp;
const createApp = async () => {
    const expressApp = (0, express_1.default)();
    const adapter = new platform_express_1.ExpressAdapter(expressApp);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter, {
        logger: ["error", "warn", "log"],
    });
    app.enableCors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
    });
    app.setGlobalPrefix("api");
    await app.init();
    return expressApp;
};
const handler = async (event, context) => {
    if (!cachedApp) {
        try {
            const app = await createApp();
            cachedApp = (0, serverless_express_1.configure)({
                app,
            });
        }
        catch (error) {
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
    }
    catch (error) {
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
exports.handler = handler;
//# sourceMappingURL=api.js.map