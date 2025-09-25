import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { BillController } from "./controllers/bill.controller";
import { UserService } from "./services/user.service";
import { BillService } from "./services/bill.service";
import { RewardService } from "./services/reward.service";
import { repositoryProviders } from "./models/repositories.provider";

@Module({
  imports: [DatabaseModule],
  controllers: [BillController],
  providers: [UserService, BillService, RewardService, ...repositoryProviders],
})
export class AppModule {}
