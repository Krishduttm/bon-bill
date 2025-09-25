import { Bill } from "../models/bill.model";
import { RewardService } from "./reward.service";
export interface CreateBillDto {
    userId: number;
    amount: number;
    dueDate: Date;
    description?: string;
}
export interface PayBillDto {
    paidDate?: Date;
}
export declare class BillService {
    private billRepository;
    private rewardService;
    private readonly logger;
    constructor(billRepository: typeof Bill, rewardService: RewardService);
    create(createBillDto: CreateBillDto): Promise<Bill>;
    findAll(): Promise<Bill[]>;
    findByUserId(userId: number): Promise<Bill[]>;
    findOne(id: number): Promise<Bill>;
    payBill(id: number, payBillDto: PayBillDto): Promise<{
        bill: Bill;
        reward?: any;
    }>;
    private checkAndGenerateReward;
    getRecentBillsByUser(userId: number, limit?: number): Promise<Bill[]>;
    getUnpaidBillsByUser(userId: number): Promise<Bill[]>;
    update(id: number, updateBillDto: Partial<CreateBillDto>): Promise<Bill>;
}
