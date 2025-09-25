import { UserService, CreateUserDto } from "../services/user.service";
import { RewardService } from "../services/reward.service";
export declare class UserController {
    private readonly userService;
    private readonly rewardService;
    private readonly logger;
    constructor(userService: UserService, rewardService: RewardService);
    create(createUserDto: CreateUserDto): Promise<import("../models/user.model").User>;
    findAll(): Promise<import("../models/user.model").User[]>;
    findOne(id: number): Promise<import("../models/user.model").User>;
    getUserRewards(id: number): Promise<import("../models/reward.model").Reward[]>;
    getUnredeemedRewards(id: number): Promise<import("../models/reward.model").Reward[]>;
    getTotalRewardValue(id: number): Promise<{
        userId: number;
        totalRewardValue: number;
    }>;
    update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<import("../models/user.model").User>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
