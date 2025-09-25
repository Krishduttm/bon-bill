import { Model } from "sequelize-typescript";
import { Bill } from "./bill.model";
import { Reward } from "./reward.model";
export declare class User extends Model<User> {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    creditCardNumber: string;
    bills: Bill[];
    rewards: Reward[];
}
