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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bill_model_1 = require("../models/bill.model");
const reward_model_1 = require("../models/reward.model");
let UserService = UserService_1 = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserService_1.name);
    }
    async create(createUserDto) {
        try {
            this.logger.log(`Creating user with email: ${createUserDto.email}`);
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email },
            });
            if (existingUser) {
                this.logger.warn(`User with email ${createUserDto.email} already exists`);
                throw new Error(`User with email ${createUserDto.email} already exists`);
            }
            const user = await this.userRepository.create(createUserDto);
            this.logger.log(`Successfully created user with ID: ${user.id}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            if (error.message.includes("already exists")) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to create user: ${error.message}`);
        }
    }
    async findAll() {
        try {
            this.logger.log("Fetching all users");
            const users = await this.userRepository.findAll({
                include: [bill_model_1.Bill, reward_model_1.Reward],
            });
            this.logger.log(`Successfully fetched ${users.length} users`);
            return users;
        }
        catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to fetch users: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching user with ID: ${id}`);
            if (!id || id <= 0) {
                throw new Error("Invalid user ID provided");
            }
            const user = await this.userRepository.findByPk(id, {
                include: [
                    {
                        model: bill_model_1.Bill,
                        order: [["dueDate", "DESC"]],
                    },
                    reward_model_1.Reward,
                ],
            });
            if (!user) {
                this.logger.warn(`User with ID ${id} not found`);
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.log(`Successfully fetched user: ${user.email}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch user: ${error.message}`);
        }
    }
    async findByEmail(email) {
        try {
            this.logger.log(`Fetching user by email: ${email}`);
            if (!email || !email.includes("@")) {
                throw new Error("Invalid email format provided");
            }
            const user = await this.userRepository.findOne({
                where: { email },
                include: [bill_model_1.Bill, reward_model_1.Reward],
            });
            if (user) {
                this.logger.log(`Successfully found user with email: ${email}`);
            }
            else {
                this.logger.log(`No user found with email: ${email}`);
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Failed to fetch user by email ${email}: ${error.message}`, error.stack);
            if (error.message.includes("Invalid email")) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch user by email: ${error.message}`);
        }
    }
    async update(id, updateUserDto) {
        try {
            this.logger.log(`Updating user with ID: ${id}`);
            if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
                throw new Error("No update data provided");
            }
            if (updateUserDto.email) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: updateUserDto.email },
                });
                if (existingUser && existingUser.id !== id) {
                    throw new Error(`Email ${updateUserDto.email} is already in use by another user`);
                }
            }
            const user = await this.findOne(id);
            const updatedUser = await user.update(updateUserDto);
            this.logger.log(`Successfully updated user with ID: ${id}`);
            return updatedUser;
        }
        catch (error) {
            this.logger.error(`Failed to update user with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException ||
                error.message.includes("already in use") ||
                error.message.includes("No update data")) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to update user: ${error.message}`);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("USER_REPOSITORY")),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map