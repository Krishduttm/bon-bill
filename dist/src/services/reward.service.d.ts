import { Reward } from "../models/reward.model";
export declare class RewardService {
    private rewardRepository;
    private readonly logger;
    constructor(rewardRepository: typeof Reward);
    generateReward(userId: number): Promise<Reward>;
    findByUserId(userId: number): Promise<Reward[]>;
    findAll(): Promise<Reward[]>;
    redeemReward(id: number): Promise<Reward>;
    private generateGiftCardCode;
    getUnredeemedRewardsByUser(userId: number): Promise<Reward[]>;
    getTotalRewardValueByUser(userId: number): Promise<number>;
}
