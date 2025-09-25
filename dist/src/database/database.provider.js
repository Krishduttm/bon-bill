"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const common_1 = require("@nestjs/common");
const user_model_1 = require("../models/user.model");
const bill_model_1 = require("../models/bill.model");
const reward_model_1 = require("../models/reward.model");
const config_1 = require("../../config");
const logger = new common_1.Logger("DatabaseProvider");
exports.databaseProviders = [
    {
        provide: "SEQUELIZE",
        useFactory: async () => {
            try {
                logger.log("Initializing database connection...");
                const sequelize = new sequelize_typescript_1.Sequelize({
                    dialect: "postgres",
                    host: config_1.config.database.host,
                    port: config_1.config.database.port,
                    username: config_1.config.database.username,
                    password: config_1.config.database.password,
                    database: config_1.config.database.database,
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
                });
                await sequelize.authenticate();
                logger.log("✅ Database connection established successfully");
                sequelize.addModels([user_model_1.User, bill_model_1.Bill, reward_model_1.Reward]);
                logger.log("📋 Database models loaded");
                await sequelize.sync();
                logger.log("🔄 Database models synchronized");
                return sequelize;
            }
            catch (error) {
                logger.error("❌ Failed to initialize database connection", error.stack);
                throw error;
            }
        },
    },
];
//# sourceMappingURL=database.provider.js.map