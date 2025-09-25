import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService, CreateUserDto } from "../services/user.service";
import { RewardService } from "../services/reward.service";

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rewardService: RewardService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(":id/rewards")
  getUserRewards(@Param("id", ParseIntPipe) id: number) {
    return this.rewardService.findByUserId(id);
  }

  @Get(":id/rewards/unredeemed")
  getUnredeemedRewards(@Param("id", ParseIntPipe) id: number) {
    return this.rewardService.getUnredeemedRewardsByUser(id);
  }

  @Get(":id/rewards/total-value")
  async getTotalRewardValue(@Param("id", ParseIntPipe) id: number) {
    const totalValue = await this.rewardService.getTotalRewardValueByUser(id);
    return { userId: id, totalRewardValue: totalValue };
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>
  ) {
    return this.userService.update(id, updateUserDto);
  }
}
