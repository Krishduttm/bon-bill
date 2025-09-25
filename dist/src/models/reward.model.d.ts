import { Model } from "sequelize-typescript";
import { User } from "./user.model";
export declare enum RewardType {
    AMAZON_GIFT_CARD = "AMAZON_GIFT_CARD",
    STARBUCKS_GIFT_CARD = "STARBUCKS_GIFT_CARD",
    TARGET_GIFT_CARD = "TARGET_GIFT_CARD",
    CASH_BACK = "CASH_BACK"
}
export declare class Reward extends Model<Reward> {
    id: number;
    userId: number;
    type: RewardType;
    value: number;
    description: string;
    giftCardCode: string;
    earnedDate: Date;
    isRedeemed: boolean;
    redeemedDate: Date;
    user: User;
}
