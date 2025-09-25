import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Patch,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import {
  BillService,
  CreateBillDto,
  PayBillDto,
} from "../services/bill.service";

@Controller("bills")
export class BillController {
  private readonly logger = new Logger(BillController.name);

  constructor(private readonly billService: BillService) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto) {
    try {
      this.logger.log(`Creating new bill for user ${createBillDto.userId}`);
      const bill = await this.billService.create(createBillDto);
      return {
        bill,
        message: "Bill created successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to create bill: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to create bill",
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll() {
    try {
      this.logger.log("Fetching all bills");
      const bills = await this.billService.findAll();
      return {
        bills,
        count: bills.length,
        message: "Bills retrieved successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch bills: ${error.message}`,
        error.stack
      );
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to fetch bills",
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    try {
      this.logger.log(`Fetching bill with ID: ${id}`);
      const bill = await this.billService.findOne(id);
      return {
        bill,
        message: "Bill retrieved successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch bill ${id}: ${error.message}`,
        error.stack
      );
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          status,
          error: "Failed to fetch bill",
          message: error.message,
        },
        status
      );
    }
  }

  @Get("user/:userId")
  async findByUser(@Param("userId", ParseIntPipe) userId: number) {
    try {
      this.logger.log(`Fetching bills for user ${userId}`);
      const bills = await this.billService.findByUserId(userId);
      return {
        bills,
        count: bills.length,
        userId,
        message: "User bills retrieved successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch bills for user ${userId}: ${error.message}`,
        error.stack
      );
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          status,
          error: "Failed to fetch user bills",
          message: error.message,
        },
        status
      );
    }
  }

  @Get("user/:userId/unpaid")
  async findUnpaidByUser(@Param("userId", ParseIntPipe) userId: number) {
    try {
      this.logger.log(`Fetching unpaid bills for user ${userId}`);
      const bills = await this.billService.getUnpaidBillsByUser(userId);
      return {
        bills,
        count: bills.length,
        userId,
        message: "Unpaid bills retrieved successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch unpaid bills for user ${userId}: ${error.message}`,
        error.stack
      );
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          status,
          error: "Failed to fetch unpaid bills",
          message: error.message,
        },
        status
      );
    }
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBillDto: Partial<CreateBillDto>
  ) {
    try {
      this.logger.log(`Updating bill ${id}`);
      const bill = await this.billService.update(id, updateBillDto);
      return {
        bill,
        message: "Bill updated successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to update bill ${id}: ${error.message}`,
        error.stack
      );
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          status,
          error: "Failed to update bill",
          message: error.message,
        },
        status
      );
    }
  }

  @Patch(":id/pay")
  async payBill(
    @Param("id", ParseIntPipe) id: number,
    @Body() payBillDto: PayBillDto
  ) {
    try {
      this.logger.log(`Processing payment for bill ID: ${id}`);
      const result = await this.billService.payBill(id, payBillDto);

      const successMessage = result.reward
        ? `Bill paid successfully! You've earned a reward: ${result.reward.description}`
        : "Bill paid successfully!";

      return {
        bill: result.bill,
        reward: result.reward,
        message: successMessage,
      };
    } catch (error) {
      this.logger.error(
        `Failed to process payment for bill ${id}: ${error.message}`,
        error.stack
      );
      const status = error.message.includes("already paid")
        ? HttpStatus.CONFLICT
        : error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        {
          status,
          error: "Failed to process bill payment",
          message: error.message,
        },
        status
      );
    }
  }
}
