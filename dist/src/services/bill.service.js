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
var BillService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const common_1 = require("@nestjs/common");
const user_model_1 = require("../models/user.model");
const reward_service_1 = require("./reward.service");
const sequelize_1 = require("sequelize");
let BillService = BillService_1 = class BillService {
    constructor(billRepository, rewardService) {
        this.billRepository = billRepository;
        this.rewardService = rewardService;
        this.logger = new common_1.Logger(BillService_1.name);
    }
    async create(createBillDto) {
        try {
            this.logger.log(`Creating bill for user ${createBillDto.userId} with amount $${createBillDto.amount}`);
            if (!createBillDto.userId || createBillDto.userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            if (!createBillDto.amount || createBillDto.amount <= 0) {
                throw new common_1.BadRequestException("Valid amount is required");
            }
            if (!createBillDto.dueDate) {
                throw new common_1.BadRequestException("Due date is required");
            }
            const dueDate = new Date(createBillDto.dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new common_1.BadRequestException("Invalid due date format");
            }
            const bill = await this.billRepository.create(createBillDto);
            this.logger.log(`Successfully created bill with ID: ${bill.id}`);
            return bill;
        }
        catch (error) {
            this.logger.error(`Failed to create bill: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to create bill: ${error.message}`);
        }
    }
    async findAll() {
        try {
            this.logger.log("Fetching all bills");
            const bills = await this.billRepository.findAll({
                include: [user_model_1.User],
                order: [["dueDate", "DESC"]],
            });
            this.logger.log(`Successfully fetched ${bills.length} bills`);
            return bills;
        }
        catch (error) {
            this.logger.error(`Failed to fetch bills: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to fetch bills: ${error.message}`);
        }
    }
    async findByUserId(userId) {
        try {
            this.logger.log(`Fetching bills for user ID: ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const bills = await this.billRepository.findAll({
                where: { userId },
                include: [user_model_1.User],
                order: [["dueDate", "DESC"]],
            });
            this.logger.log(`Successfully fetched ${bills.length} bills for user ${userId}`);
            return bills;
        }
        catch (error) {
            this.logger.error(`Failed to fetch bills for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch bills for user: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            this.logger.log(`Fetching bill with ID: ${id}`);
            if (!id || id <= 0) {
                throw new common_1.BadRequestException("Valid bill ID is required");
            }
            const bill = await this.billRepository.findByPk(id, {
                include: [user_model_1.User],
            });
            if (!bill) {
                this.logger.warn(`Bill with ID ${id} not found`);
                throw new common_1.NotFoundException(`Bill with ID ${id} not found`);
            }
            this.logger.log(`Successfully fetched bill with ID: ${id}`);
            return bill;
        }
        catch (error) {
            this.logger.error(`Failed to fetch bill with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch bill: ${error.message}`);
        }
    }
    async payBill(id, payBillDto) {
        try {
            this.logger.log(`Processing payment for bill ID: ${id}`);
            const bill = await this.findOne(id);
            if (bill.isPaid) {
                throw new common_1.BadRequestException("Bill is already paid");
            }
            const paidDate = payBillDto.paidDate
                ? new Date(payBillDto.paidDate)
                : new Date();
            if (isNaN(paidDate.getTime())) {
                throw new common_1.BadRequestException("Invalid payment date format");
            }
            const isPaidOnTime = paidDate <= bill.dueDate;
            await bill.update({
                paidDate,
                isPaid: true,
                isPaidOnTime,
            });
            let reward = null;
            if (isPaidOnTime) {
                reward = await this.checkAndGenerateReward(bill.userId);
            }
            return { bill, reward };
        }
        catch (error) {
            this.logger.error(`Failed to process payment for bill ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to process bill payment: ${error.message}`);
        }
    }
    async checkAndGenerateReward(userId) {
        try {
            this.logger.log(`Checking reward eligibility for user ${userId}`);
            const eligibleBills = await this.billRepository.findAll({
                where: {
                    userId,
                    isPaid: true,
                    isPaidOnTime: true,
                    countedForReward: false,
                },
                order: [["paidDate", "ASC"]],
            });
            this.logger.log(`Found ${eligibleBills.length} eligible bills (paid on time, not counted for rewards) for user ${userId}`);
            if (eligibleBills.length >= 3) {
                const billsForReward = eligibleBills.slice(0, 3);
                this.logger.log(`User ${userId} qualifies for reward - 3 consecutive on-time payments (bills: ${billsForReward
                    .map((b) => b.id)
                    .join(", ")})`);
                const reward = await this.rewardService.generateReward(userId);
                await Promise.all(billsForReward.map((bill) => bill.update({ countedForReward: true })));
                return reward;
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Error checking reward eligibility for user ${userId}: ${error.message}`, error.stack);
            return null;
        }
    }
    async getRecentBillsByUser(userId, limit = 3) {
        try {
            this.logger.log(`Fetching recent bills for user ${userId} with limit ${limit}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            if (limit <= 0 || limit > 100) {
                throw new common_1.BadRequestException("Limit must be between 1 and 100");
            }
            const bills = await this.billRepository.findAll({
                where: {
                    userId,
                    isPaid: true,
                },
                order: [["paidDate", "DESC"]],
                limit,
            });
            this.logger.log(`Successfully fetched ${bills.length} recent bills for user ${userId}`);
            return bills;
        }
        catch (error) {
            this.logger.error(`Failed to fetch recent bills for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch recent bills: ${error.message}`);
        }
    }
    async getUnpaidBillsByUser(userId) {
        try {
            this.logger.log(`Fetching unpaid bills for user ${userId}`);
            if (!userId || userId <= 0) {
                throw new common_1.BadRequestException("Valid user ID is required");
            }
            const bills = await this.billRepository.findAll({
                where: {
                    userId,
                    isPaid: false,
                    dueDate: {
                        [sequelize_1.Op.gte]: new Date(),
                    },
                },
                order: [["dueDate", "ASC"]],
            });
            this.logger.log(`Successfully fetched ${bills.length} unpaid bills for user ${userId}`);
            return bills;
        }
        catch (error) {
            this.logger.error(`Failed to fetch unpaid bills for user ${userId}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to fetch unpaid bills: ${error.message}`);
        }
    }
    async update(id, updateBillDto) {
        try {
            this.logger.log(`Updating bill with ID: ${id}`);
            if (!updateBillDto || Object.keys(updateBillDto).length === 0) {
                throw new common_1.BadRequestException("No update data provided");
            }
            if (updateBillDto.amount !== undefined && updateBillDto.amount <= 0) {
                throw new common_1.BadRequestException("Amount must be greater than 0");
            }
            if (updateBillDto.dueDate) {
                const dueDate = new Date(updateBillDto.dueDate);
                if (isNaN(dueDate.getTime())) {
                    throw new common_1.BadRequestException("Invalid due date format");
                }
            }
            const bill = await this.findOne(id);
            if (bill.isPaid) {
                throw new common_1.BadRequestException("Cannot update a paid bill");
            }
            const updatedBill = await bill.update(updateBillDto);
            this.logger.log(`Successfully updated bill with ID: ${id}`);
            return updatedBill;
        }
        catch (error) {
            this.logger.error(`Failed to update bill with ID ${id}: ${error.message}`, error.stack);
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Failed to update bill: ${error.message}`);
        }
    }
};
exports.BillService = BillService;
exports.BillService = BillService = BillService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("BILL_REPOSITORY")),
    __metadata("design:paramtypes", [Object, reward_service_1.RewardService])
], BillService);
//# sourceMappingURL=bill.service.js.map