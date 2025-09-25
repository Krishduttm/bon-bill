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
