"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryProviders = void 0;
const user_model_1 = require("./user.model");
const bill_model_1 = require("./bill.model");
const reward_model_1 = require("./reward.model");
exports.repositoryProviders = [
    {
        provide: "USER_REPOSITORY",
        useValue: user_model_1.User,
    },
    {
        provide: "BILL_REPOSITORY",
        useValue: bill_model_1.Bill,
    },
    {
        provide: "REWARD_REPOSITORY",
        useValue: reward_model_1.Reward,
    },
];
//# sourceMappingURL=repositories.provider.js.map