import { User } from "./user.model";
import { Bill } from "./bill.model";
import { Reward } from "./reward.model";
export const repositoryProviders = [
    {
        provide: "USER_REPOSITORY",
        useValue: User,
    },
    {
        provide: "BILL_REPOSITORY",
        useValue: Bill,
    },
    {
        provide: "REWARD_REPOSITORY",
        useValue: Reward,
    },
];
