import { BillService, PayBillDto } from "../services/bill.service";
export declare class BillController {
    private readonly billService;
    private readonly logger;
    constructor(billService: BillService);
    payBill(id: number, payBillDto: PayBillDto): Promise<{
        bill: import("../models/bill.model").Bill;
        reward: any;
        message: string;
    }>;
}
