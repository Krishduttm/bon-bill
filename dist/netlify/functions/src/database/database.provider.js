import { Sequelize } from "sequelize-typescript";
import { Logger } from "@nestjs/common";
import { User } from "../models/user.model";
import { Bill } from "../models/bill.model";
import { Reward } from "../models/reward.model";
import { config } from "../../config";
const logger = new Logger("DatabaseProvider");
export const databaseProviders = [
    {
        provide: "SEQUELIZE",
        useFactory: async () => {
            try {
                logger.log("Initializing database connection...");
                const sequelize = new Sequelize({
                    dialect: "postgres",
                    host: config.database.host,
                    port: config.database.port,
                    username: config.database.username,
                    password: config.database.password,
                    database: config.database.database,
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
                // Test the connection
                await sequelize.authenticate();
                logger.log("✅ Database connection established successfully");
                // Add models
                sequelize.addModels([User, Bill, Reward]);
                logger.log("📋 Database models loaded");
                // Sync models
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
