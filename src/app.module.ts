import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { BillController } from "./controllers/bill.controller";
import { UserController } from "./controllers/user.controller";
import { RewardController } from "./controllers/reward.controller";
import { HealthController } from "./controllers/health.controller";
import { UserService } from "./services/user.service";
import { BillService } from "./services/bill.service";
import { RewardService } from "./services/reward.service";
import { repositoryProviders } from "./models/repositories.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [
    BillController,
    UserController,
    RewardController,
    HealthController,
  ],
  providers: [UserService, BillService, RewardService, ...repositoryProviders],
})
export class AppModule {}
