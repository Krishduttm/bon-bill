"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const logger = new common_1.Logger("DatabaseSetup");
async function setupDatabase() {
    let app;
    try {
        logger.log("🔧 Starting database setup...");
        app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
            logger: ["log", "error", "warn"],
        });
        const sequelize = app.get("SEQUELIZE");
        if (!sequelize) {
            throw new Error("Failed to get Sequelize instance");
        }
        logger.log("🔄 Synchronizing database tables...");
        await sequelize.sync({ alter: true });
        logger.log("✅ Database tables created successfully!");
        await sequelize.authenticate();
        logger.log("🔌 Database connection verified!");
        const tables = await sequelize.getQueryInterface().showAllTables();
        logger.log(`📊 Created/updated ${tables.length} tables: ${tables.join(", ")}`);
    }
    catch (error) {
        logger.error("❌ Error setting up database:", error.message);
        logger.error("Stack trace:", error.stack);
        process.exit(1);
    }
    finally {
        if (app) {
            try {
                await app.close();
                logger.log("🔚 Application context closed successfully");
            }
            catch (closeError) {
                logger.error("Error closing application context:", closeError.message);
            }
        }
    }
}
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception in database setup:", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection in database setup at:", promise, "reason:", reason);
    process.exit(1);
});
setupDatabase();
//# sourceMappingURL=setup-db.js.map