"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RewardController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardController = void 0;
const common_1 = require("@nestjs/common");
const reward_service_1 = require("../services/reward.service");
let RewardController = RewardController_1 = class RewardController {
    constructor(rewardService) {
        this.rewardService = rewardService;
        this.logger = new common_1.Logger(RewardController_1.name);
    }
    async findAll() {
        try {
            this.logger.log("Fetching all rewards");
            const rewards = await this.rewardService.findAll();
            this.logger.log(`Successfully fetched ${rewards.length} rewards`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rewards: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to fetch rewards",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByUserId(userId) {
        try {
            this.logger.log(`Fetching rewards for user ID: ${userId}`);
            const rewards = await this.rewardService.findByUserId(userId);
            this.logger.log(`Successfully fetched ${rewards.length} rewards for user ${userId}`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rewards for user ${userId}: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to fetch user rewards",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateReward(userId) {
        try {
            this.logger.log(`Generating reward for user ID: ${userId}`);
            const reward = await this.rewardService.generateReward(userId);
            this.logger.log(`Successfully generated reward: ${reward.description} for user ${userId}`);
            return reward;
        }
        catch (error) {
            this.logger.error(`Failed to generate reward for user ${userId}: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to generate reward",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async redeemReward(id) {
        try {
            this.logger.log(`Redeeming reward with ID: ${id}`);
            const reward = await this.rewardService.redeemReward(id);
            this.logger.log(`Successfully redeemed reward: ${reward.description} with code: ${reward.giftCardCode}`);
            return {
                reward,
                message: `Reward redeemed successfully! Code: ${reward.giftCardCode}`,
            };
        }
        catch (error) {
            this.logger.error(`Failed to redeem reward with ID ${id}: ${error.message}`, error.stack);
            const status = error.message.includes("not found")
                ? common_1.HttpStatus.NOT_FOUND
                : error.message.includes("already been redeemed")
                    ? common_1.HttpStatus.CONFLICT
                    : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            throw new common_1.HttpException({
                status,
                error: "Failed to redeem reward",
                message: error.message,
            }, status);
        }
    }
};
exports.RewardController = RewardController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)("generate/:userId"),
    __param(0, (0, common_1.Param)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "generateReward", null);
__decorate([
    (0, common_1.Patch)(":id/redeem"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RewardController.prototype, "redeemReward", null);
exports.RewardController = RewardController = RewardController_1 = __decorate([
    (0, common_1.Controller)("rewards"),
    __metadata("design:paramtypes", [reward_service_1.RewardService])
], RewardController);
//# sourceMappingURL=reward.controller.js.map