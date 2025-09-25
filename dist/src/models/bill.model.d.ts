import { Model } from "sequelize-typescript";
import { User } from "./user.model";
export declare class Bill extends Model<Bill> {
    id: number;
    userId: number;
    amount: number;
    dueDate: Date;
    paidDate: Date;
    isPaid: boolean;
    isPaidOnTime: boolean;
    countedForReward: boolean;
    description: string;
    user: User;
    checkPaidOnTime(): boolean;
}
