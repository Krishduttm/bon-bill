import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
} from "@nestjs/common";
import { RewardService } from "../services/reward.service";

@Controller("rewards")
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  findAll() {
    return this.rewardService.findAll();
  }

  @Get("user/:userId")
  findByUserId(@Param("userId", ParseIntPipe) userId: number) {
    return this.rewardService.findByUserId(userId);
  }

  @Post("generate/:userId")
  generateReward(@Param("userId", ParseIntPipe) userId: number) {
    return this.rewardService.generateReward(userId);
  }

  @Patch(":id/redeem")
  async redeemReward(@Param("id", ParseIntPipe) id: number) {
    const reward = await this.rewardService.redeemReward(id);
    return {
      reward,
      message: `Reward redeemed successfully! Code: ${reward.giftCardCode}`,
    };
  }
}
