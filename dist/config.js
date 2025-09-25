"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const parseDatabaseUrl = (url) => {
    const parsed = new URL(url);
    return {
        host: parsed.hostname,
        port: parseInt(parsed.port) || 5432,
        username: parsed.username,
        password: parsed.password,
        database: parsed.pathname.slice(1),
    };
};
const databaseUrl = process.env.DATABASE_URL;
const parsedUrl = databaseUrl ? parseDatabaseUrl(databaseUrl) : null;
exports.config = {
    database: {
        host: process.env.DATABASE_HOST || process.env.DB_HOST || (parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.host) || "localhost",
        port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) || (parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.port) || 5432,
        username: process.env.DATABASE_USERNAME || process.env.DB_USERNAME || (parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.username) || "postgres",
        password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || (parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.password) || "password",
        database: process.env.DATABASE_NAME || process.env.DB_NAME || (parsedUrl === null || parsedUrl === void 0 ? void 0 : parsedUrl.database) || "bon_rewards",
    },
    port: parseInt(process.env.PORT) || 3000,
};
//# sourceMappingURL=config.js.map