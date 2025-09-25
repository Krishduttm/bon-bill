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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const reward_service_1 = require("../services/reward.service");
let UserController = UserController_1 = class UserController {
    constructor(userService, rewardService) {
        this.userService = userService;
        this.rewardService = rewardService;
        this.logger = new common_1.Logger(UserController_1.name);
    }
    async create(createUserDto) {
        try {
            this.logger.log(`Creating new user with email: ${createUserDto.email}`);
            const user = await this.userService.create(createUserDto);
            this.logger.log(`Successfully created user with ID: ${user.id}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: "Failed to create user",
                message: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            this.logger.log("Fetching all users");
            const users = await this.userService.findAll();
            this.logger.log(`Successfully fetched ${users.length} users`);
            return users;
        }
        catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to fetch users",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching user with ID: ${id}`);
            const user = await this.userService.findOne(id);
            this.logger.log(`Successfully fetched user: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
            const status = error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            throw new common_1.HttpException({
                status,
                error: "Failed to fetch user",
                message: error.message,
            }, status);
        }
    }
    async getUserRewards(id) {
        try {
            this.logger.log(`Fetching rewards for user ID: ${id}`);
            const rewards = await this.rewardService.findByUserId(id);
            this.logger.log(`Successfully fetched ${rewards.length} rewards for user ${id}`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch rewards for user ${id}: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to fetch user rewards",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUnredeemedRewards(id) {
        try {
            this.logger.log(`Fetching unredeemed rewards for user ID: ${id}`);
            const rewards = await this.rewardService.getUnredeemedRewardsByUser(id);
            this.logger.log(`Successfully fetched ${rewards.length} unredeemed rewards for user ${id}`);
            return rewards;
        }
        catch (error) {
            this.logger.error(`Failed to fetch unredeemed rewards for user ${id}: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to fetch unredeemed rewards",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTotalRewardValue(id) {
        try {
            this.logger.log(`Calculating total reward value for user ID: ${id}`);
            const totalValue = await this.rewardService.getTotalRewardValueByUser(id);
            this.logger.log(`Successfully calculated total reward value: $${totalValue} for user ${id}`);
            return { userId: id, totalRewardValue: totalValue };
        }
        catch (error) {
            this.logger.error(`Failed to calculate total reward value for user ${id}: ${error.message}`, error.stack);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to calculate total reward value",
                message: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateUserDto) {
        try {
            this.logger.log(`Updating user with ID: ${id}`);
            const user = await this.userService.update(id, updateUserDto);
            this.logger.log(`Successfully updated user: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to update user with ID ${id}: ${error.message}`, error.stack);
            const status = error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            throw new common_1.HttpException({
                status,
                error: "Failed to update user",
                message: error.message,
            }, status);
        }
    }
    async remove(id) {
        try {
            this.logger.log(`Deleting user with ID: ${id}`);
            await this.userService.remove(id);
            this.logger.log(`Successfully deleted user with ID: ${id}`);
            return { message: `User with ID ${id} has been successfully deleted` };
        }
        catch (error) {
            this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`, error.stack);
            const status = error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            throw new common_1.HttpException({
                status,
                error: "Failed to delete user",
                message: error.message,
            }, status);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/rewards"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserRewards", null);
__decorate([
    (0, common_1.Get)(":id/rewards/unredeemed"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUnredeemedRewards", null);
__decorate([
    (0, common_1.Get)(":id/rewards/total-value"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTotalRewardValue", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        reward_service_1.RewardService])
], UserController);
//# sourceMappingURL=user.controller.js.map