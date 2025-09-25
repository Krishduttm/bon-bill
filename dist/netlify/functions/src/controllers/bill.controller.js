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
var BillController_1;
import { Controller, Body, Param, ParseIntPipe, Patch, HttpException, HttpStatus, Logger, } from "@nestjs/common";
import { BillService, } from "../services/bill.service";
let BillController = BillController_1 = class BillController {
    constructor(billService) {
        this.billService = billService;
        this.logger = new Logger(BillController_1.name);
    }
    async payBill(id, payBillDto) {
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
        }
        catch (error) {
            this.logger.error(`Failed to process payment for bill ${id}: ${error.message}`, error.stack);
            const status = error.message.includes("already paid")
                ? HttpStatus.CONFLICT
                : error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException({
                status,
                error: "Failed to process bill payment",
                message: error.message,
            }, status);
        }
    }
};
__decorate([
    Patch(":id/pay"),
    __param(0, Param("id", ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BillController.prototype, "payBill", null);
BillController = BillController_1 = __decorate([
    Controller("bills"),
    __metadata("design:paramtypes", [BillService])
], BillController);
export { BillController };
