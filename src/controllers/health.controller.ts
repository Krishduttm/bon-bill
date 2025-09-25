import { Controller, Get, Inject } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";

@Controller("health")
export class HealthController {
  constructor(
    @Inject("SEQUELIZE")
    private readonly sequelize: Sequelize
  ) {}

  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "API is running",
      environment: process.env.NODE_ENV || "unknown",
    };
  }

  @Get("db")
  async checkDatabase() {
    try {
      // Test database connection
      await this.sequelize.authenticate();

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Database connection successful",
        database: {
          dialect: this.sequelize.getDialect(),
          host: this.sequelize.config.host,
          database: this.sequelize.config.database,
          port: this.sequelize.config.port,
        },
      };
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Database connection failed",
        error: error.message,
        details: {
          host: this.sequelize.config.host,
          database: this.sequelize.config.database,
          port: this.sequelize.config.port,
        },
      };
    }
  }

  @Get("env")
  checkEnvironment() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Environment variables check",
      environment: {
        NODE_ENV: process.env.NODE_ENV || "not set",
        NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL
          ? "✅ Set"
          : "❌ Not set",
        DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Not set",
        DATABASE_HOST: process.env.DATABASE_HOST ? "✅ Set" : "❌ Not set",
      },
    };
  }
}
