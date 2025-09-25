import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Reward, RewardType } from "../models/reward.model";
import { User } from "../models/user.model";

@Injectable()
export class RewardService {
  private readonly logger = new Logger(RewardService.name);

  constructor(
    @Inject("REWARD_REPOSITORY")
    private rewardRepository: typeof Reward
  ) {}

  async generateReward(userId: number): Promise<Reward> {
    try {
      this.logger.log(`Generating reward for user ID: ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      // Generate a random gift card reward
      const rewardTypes = [
        {
          type: RewardType.AMAZON_GIFT_CARD,
          value: 10,
          description: "$10 Amazon Gift Card",
        },
        {
          type: RewardType.STARBUCKS_GIFT_CARD,
          value: 5,
          description: "$5 Starbucks Gift Card",
        },
        {
          type: RewardType.TARGET_GIFT_CARD,
          value: 15,
          description: "$15 Target Gift Card",
        },
        { type: RewardType.CASH_BACK, value: 5, description: "$5 Cash Back" },
      ];

      const randomReward =
        rewardTypes[Math.floor(Math.random() * rewardTypes.length)];

      const reward = await this.rewardRepository.create({
        userId,
        type: randomReward.type,
        value: randomReward.value,
        description: randomReward.description,
        giftCardCode: this.generateGiftCardCode(),
        earnedDate: new Date(),
      });

      this.logger.log(
        `Successfully generated reward: ${reward.description} for user ${userId}`
      );
      return reward;
    } catch (error) {
      this.logger.error(
        `Failed to generate reward for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate reward: ${error.message}`
      );
    }
  }

  async findByUserId(userId: number): Promise<Reward[]> {
    try {
      this.logger.log(`Fetching rewards for user ID: ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      const rewards = await this.rewardRepository.findAll({
        where: { userId },
        include: [User],
        order: [["earnedDate", "DESC"]],
      });

      this.logger.log(
        `Successfully fetched ${rewards.length} rewards for user ${userId}`
      );
      return rewards;
    } catch (error) {
      this.logger.error(
        `Failed to fetch rewards for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch user rewards: ${error.message}`
      );
    }
  }

  async findAll(): Promise<Reward[]> {
    try {
      this.logger.log("Fetching all rewards");
      const rewards = await this.rewardRepository.findAll({
        include: [User],
        order: [["earnedDate", "DESC"]],
      });
      this.logger.log(`Successfully fetched ${rewards.length} rewards`);
      return rewards;
    } catch (error) {
      this.logger.error(
        `Failed to fetch rewards: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException(
        `Failed to fetch rewards: ${error.message}`
      );
    }
  }

  async redeemReward(id: number): Promise<Reward> {
    try {
      this.logger.log(`Redeeming reward with ID: ${id}`);

      if (!id || id <= 0) {
        throw new BadRequestException("Valid reward ID is required");
      }

      const reward = await this.rewardRepository.findByPk(id);

      if (!reward) {
        this.logger.warn(`Reward with ID ${id} not found`);
        throw new NotFoundException("Reward not found");
      }

      if (reward.isRedeemed) {
        this.logger.warn(
          `Attempted to redeem already redeemed reward ID: ${id}`
        );
        throw new BadRequestException("Reward has already been redeemed");
      }

      await reward.update({
        isRedeemed: true,
        redeemedDate: new Date(),
      });

      this.logger.log(
        `Successfully redeemed reward: ${reward.description} with code: ${reward.giftCardCode}`
      );
      return reward;
    } catch (error) {
      this.logger.error(
        `Failed to redeem reward with ID ${id}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to redeem reward: ${error.message}`
      );
    }
  }

  private generateGiftCardCode(): string {
    // Generate a mock gift card code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getUnredeemedRewardsByUser(userId: number): Promise<Reward[]> {
    try {
      this.logger.log(`Fetching unredeemed rewards for user ID: ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      const rewards = await this.rewardRepository.findAll({
        where: {
          userId,
          isRedeemed: false,
        },
        order: [["earnedDate", "DESC"]],
      });

      this.logger.log(
        `Successfully fetched ${rewards.length} unredeemed rewards for user ${userId}`
      );
      return rewards;
    } catch (error) {
      this.logger.error(
        `Failed to fetch unredeemed rewards for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch unredeemed rewards: ${error.message}`
      );
    }
  }

  async getTotalRewardValueByUser(userId: number): Promise<number> {
    try {
      this.logger.log(`Calculating total reward value for user ID: ${userId}`);

      if (!userId || userId <= 0) {
        throw new BadRequestException("Valid user ID is required");
      }

      const rewards = await this.findByUserId(userId);
      const totalValue = rewards.reduce(
        (total, reward) => total + Number(reward.value),
        0
      );

      this.logger.log(
        `Successfully calculated total reward value: $${totalValue} for user ${userId}`
      );
      return totalValue;
    } catch (error) {
      this.logger.error(
        `Failed to calculate total reward value for user ${userId}: ${error.message}`,
        error.stack
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to calculate total reward value: ${error.message}`
      );
    }
  }
}
