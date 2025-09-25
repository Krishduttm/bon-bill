"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const bill_controller_1 = require("./controllers/bill.controller");
const user_service_1 = require("./services/user.service");
const bill_service_1 = require("./services/bill.service");
const reward_service_1 = require("./services/reward.service");
const repositories_provider_1 = require("./models/repositories.provider");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [bill_controller_1.BillController],
        providers: [user_service_1.UserService, bill_service_1.BillService, reward_service_1.RewardService, ...repositories_provider_1.repositoryProviders],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map