import {
  Injectable,
  Inject,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { Bill } from "../models/bill.model";
import { User } from "../models/user.model";
import { RewardService } from "./reward.service";
import { Op } from "sequelize";

export interface CreateBillDto {
  userId: number;
  amount: number;
  dueDate: Date;
  description?: string;
}

export interface PayBillDto {
  paidDate?: Date;
}

@Injectable()
export class BillService {
  private readonly logger = new Logger(BillService.name);

  constructor(
    @Inject("BILL_REPOSITORY")
    private billRepository: typeof Bill,
    private rewardService: RewardService
  ) {}

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    try {
      this.logger.log(
        `Creating bill for user ${createBillDto.userId} with amount $${createBillDto.amount}`
      );

      // Validate input data
      if (!createBillDto.userId || createBillDto.userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      if (!createBillDto.amount || createBillDto.amount <= 0) {
        throw new BadRequestException("Valid amount is required");
      }

      if (!createBillDto.dueDate) {
        throw new BadRequestException("Due date is required");
      }

      const dueDate = new Date(createBillDto.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new BadRequestException("Invalid due date format");
      }

      const bill = await this.billRepository.create(createBillDto);
      this.logger.log(`Successfully created bill with ID: ${bill.id}`);
      return bill;
    } catch (error) {
      this.logger.error(`Failed to create bill: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create bill: ${error.message}`
      );
    }
  }

  async findAll(): Promise<Bill[]> {
    try {
      this.logger.log("Fetching all bills");
      const bills = await this.billRepository.findAll({
        include: [User],
        order: [["dueDate", "DESC"]],
      });
      this.logger.log(`Successfully fetched ${bills.length} bills`);
      return bills;
    } catch (error) {
      this.logger.error(`Failed to fetch bills: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch bills: ${error.message}`
      );
    }
  }

  async findByUserId(userId: number): Promise<Bill[]> {
    try {
      this.logger.log(`Fetching bills for user ID: ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      const bills = await this.billRepository.findAll({
        where: { userId },
        include: [User],
        order: [["dueDate", "DESC"]],
      });

      this.logger.log(
        `Successfully fetched ${bills.length} bills for user ${userId}`
      );
      return bills;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bills for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch bills for user: ${error.message}`
      );
    }
  }

  async findOne(id: number): Promise<Bill> {
    try {
      this.logger.log(`Fetching bill with ID: ${id}`);

      if (!id || id <= 0) {
        throw new BadRequestException("Valid bill ID is required");
      }

      const bill = await this.billRepository.findByPk(id, {
        include: [User],
      });

      if (!bill) {
        this.logger.warn(`Bill with ID ${id} not found`);
        throw new NotFoundException(`Bill with ID ${id} not found`);
      }

      this.logger.log(`Successfully fetched bill with ID: ${id}`);
      return bill;
    } catch (error) {
      this.logger.error(
        `Failed to fetch bill with ID ${id}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch bill: ${error.message}`
      );
    }
  }

  async payBill(
    id: number,
    payBillDto: PayBillDto
  ): Promise<{ bill: Bill; reward?: any }> {
    try {
      this.logger.log(`Processing payment for bill ID: ${id}`);

      const bill = await this.findOne(id);

      if (bill.isPaid) {
        throw new BadRequestException("Bill is already paid");
      }

      const paidDate = payBillDto.paidDate
        ? new Date(payBillDto.paidDate)
        : new Date();

      if (isNaN(paidDate.getTime())) {
        throw new BadRequestException("Invalid payment date format");
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
    } catch (error) {
      this.logger.error(
        `Failed to process payment for bill ${id}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to process bill payment: ${error.message}`
      );
    }
  }

  private async checkAndGenerateReward(userId: number): Promise<any> {
    try {
      this.logger.log(`Checking reward eligibility for user ${userId}`);

      // Get the most recent paid bills in descending order (most recent first)
      const recentBills = await this.billRepository.findAll({
        where: {
          userId,
        },
        order: [["paidDate", "DESC"]], // Most recent first
        limit: 3,
      });

      // Check if the most recent 3 bills are consecutive on-time payments
      // and haven't been counted for reward yet
      if (recentBills.length < 3) {
        this.logger.log(
          `User ${userId} has less than 3 paid bills, not eligible for reward`
        );
        return null;
      }
      // All 3 must be paid on time and not already counted for reward
      const allOnTimeAndNotCounted = recentBills.every(
        (bill) => bill.isPaidOnTime && !bill.countedForReward
      );

      if (!allOnTimeAndNotCounted) {
        this.logger.log(
          `User ${userId} doesn't have 3 consecutive on-time payments that haven't been rewarded`
        );
        return null;
      }

      const reward = await this.rewardService.generateReward(userId);

      // Mark these bills as counted for reward
      await Promise.all(
        recentBills.map((bill) => bill.update({ countedForReward: true }))
      );

      return reward;
    } catch (error) {
      this.logger.error(
        `Error checking reward eligibility for user ${userId}: ${error.message}`,
        error.stack
      );
      // Don't throw here - reward generation failure shouldn't fail bill payment
      return null;
    }
  }

  async getRecentBillsByUser(
    userId: number,
    limit: number = 3
  ): Promise<Bill[]> {
    try {
      this.logger.log(
        `Fetching recent bills for user ${userId} with limit ${limit}`
      );

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      if (limit <= 0 || limit > 100) {
        throw new BadRequestException("Limit must be between 1 and 100");
      }

      const bills = await this.billRepository.findAll({
        where: {
          userId,
          isPaid: true,
        },
        order: [["paidDate", "DESC"]],
        limit,
      });

      this.logger.log(
        `Successfully fetched ${bills.length} recent bills for user ${userId}`
      );
      return bills;
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent bills for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch recent bills: ${error.message}`
      );
    }
  }

  async getUnpaidBillsByUser(userId: number): Promise<Bill[]> {
    try {
      this.logger.log(`Fetching unpaid bills for user ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      const bills = await this.billRepository.findAll({
        where: {
          userId,
          isPaid: false,
          dueDate: {
            [Op.gte]: new Date(),
          },
        },
        order: [["dueDate", "ASC"]],
      });

      this.logger.log(
        `Successfully fetched ${bills.length} unpaid bills for user ${userId}`
      );
      return bills;
    } catch (error) {
      this.logger.error(
        `Failed to fetch unpaid bills for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch unpaid bills: ${error.message}`
      );
    }
  }

  async update(
    id: number,
    updateBillDto: Partial<CreateBillDto>
  ): Promise<Bill> {
    try {
      this.logger.log(`Updating bill with ID: ${id}`);

      if (!updateBillDto || Object.keys(updateBillDto).length === 0) {
        throw new BadRequestException("No update data provided");
      }

      // Validate amount if provided
      if (updateBillDto.amount !== undefined && updateBillDto.amount <= 0) {
        throw new BadRequestException("Amount must be greater than 0");
      }

      // Validate due date if provided
      if (updateBillDto.dueDate) {
        const dueDate = new Date(updateBillDto.dueDate);
        if (isNaN(dueDate.getTime())) {
          throw new BadRequestException("Invalid due date format");
        }
      }

      const bill = await this.findOne(id);

      // Prevent updating paid bills
      if (bill.isPaid) {
        throw new BadRequestException("Cannot update a paid bill");
      }

      const updatedBill = await bill.update(updateBillDto);
      this.logger.log(`Successfully updated bill with ID: ${id}`);
      return updatedBill;
    } catch (error) {
      this.logger.error(
        `Failed to update bill with ID ${id}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update bill: ${error.message}`
      );
    }
  }
}
