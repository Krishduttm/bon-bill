import { RewardService } from "../services/reward.service";
export declare class RewardController {
    private readonly rewardService;
    private readonly logger;
    constructor(rewardService: RewardService);
    findAll(): Promise<import("../models/reward.model").Reward[]>;
    findByUserId(userId: number): Promise<import("../models/reward.model").Reward[]>;
    generateReward(userId: number): Promise<import("../models/reward.model").Reward>;
    redeemReward(id: number): Promise<{
        reward: import("../models/reward.model").Reward;
        message: string;
    }>;
}
