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
var RewardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardService = void 0;
const common_1 = require("@nestjs/common");
const reward_model_1 = require("../models/reward.model");
const user_model_1 = require("../models/user.model");
let RewardService = RewardService_1 = class RewardService {
    constructor(rewardRepository) {
        this.rewardRepository = rewardRepository;
        this.logger = new common_1.Logger(RewardService_1.name);
    }
    async generateReward(userId) {
        try {
            this.logger.log(`Generating reward for user ID: ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const rewardTypes = [
                {
                    type: reward_model_1.RewardType.AMAZON_GIFT_CARD,
                    value: 10,
                    description: "$10 Amazon Gift Card",
                },
                {
                    type: reward_model_1.RewardType.STARBUCKS_GIFT_CARD,
                    value: 5,
                    description: "$5 Starbucks Gift Card",
                },
                {
                    type: reward_model_1.RewardType.TARGET_GIFT_CARD,
                    value: 15,
                    description: "$15 Target Gift Card",
                },
                { type: reward_model_1.RewardType.CASH_BACK, value: 5, description: "$5 Cash Back" },
            ];
            const randomReward = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
            const reward = await this.rewardRepository.create({
                userId,
                type: randomReward.type,
                value: randomReward.value,
                description: randomReward.description,
                giftCardCode: this.generateGiftCardCode(),
                earnedDate: new Date(),
            });
            this.logger.log(`Successfully generated reward: ${reward.description} for user ${userId}`);
            return reward;
        }
        catch (error) {
            this.logger.error(`Failed to generate reward for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to generate reward: ${error.message}`);
        }
    }
    async findByUserId(userId) {
        try {
            this.logger.log(`Fetching rewards for user ID: ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const rewards = await this.rewardRepository.findAll({
                where: { userId },
                include: [user_model_1.User],
                order: [["earnedDate", "DESC"]],
            });
            this.logger.log(`Successfully fetched ${rewards.length} rewards for user ${userId}`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rewards for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch user rewards: ${error.message}`);
        }
    }
    async findAll() {
        try {
            this.logger.log("Fetching all rewards");
            const rewards = await this.rewardRepository.findAll({
                include: [user_model_1.User],
                order: [["earnedDate", "DESC"]],
            });
            this.logger.log(`Successfully fetched ${rewards.length} rewards`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rewards: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to fetch rewards: ${error.message}`);
        }
    }
    async redeemReward(id) {
        try {
            this.logger.log(`Redeeming reward with ID: ${id}`);
            if (!id || id <= 0) {
                throw new common_1.BadRequestException("Valid reward ID is required");
            }
            const reward = await this.rewardRepository.findByPk(id);
            if (!reward) {
                this.logger.warn(`Reward with ID ${id} not found`);
                throw new common_1.NotFoundException("Reward not found");
            }
            if (reward.isRedeemed) {
                this.logger.warn(`Attempted to redeem already redeemed reward ID: ${id}`);
                throw new common_1.BadRequestException("Reward has already been redeemed");
            }
            await reward.update({
                isRedeemed: true,
                redeemedDate: new Date(),
            });
            this.logger.log(`Successfully redeemed reward: ${reward.description} with code: ${reward.giftCardCode}`);
            return reward;
        }
        catch (error) {
            this.logger.error(`Failed to redeem reward with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to redeem reward: ${error.message}`);
        }
    }
    generateGiftCardCode() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 12; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async getUnredeemedRewardsByUser(userId) {
        try {
            this.logger.log(`Fetching unredeemed rewards for user ID: ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const rewards = await this.rewardRepository.findAll({
                where: {
                    userId,
                    isRedeemed: false,
                },
                order: [["earnedDate", "DESC"]],
            });
            this.logger.log(`Successfully fetched ${rewards.length} unredeemed rewards for user ${userId}`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch unredeemed rewards for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch unredeemed rewards: ${error.message}`);
        }
    }
    async getTotalRewardValueByUser(userId) {
        try {
            this.logger.log(`Calculating total reward value for user ID: ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const rewards = await this.findByUserId(userId);
            const totalValue = rewards.reduce((total, reward) => total + Number(reward.value), 0);
            this.logger.log(`Successfully calculated total reward value: $${totalValue} for user ${userId}`);
            return totalValue;
        }
        catch (error) {
            this.logger.error(`Failed to calculate total reward value for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to calculate total reward value: ${error.message}`);
        }
    }
};
exports.RewardService = RewardService;
exports.RewardService = RewardService = RewardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("REWARD_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], RewardService);
//# sourceMappingURL=reward.service.js.map