import { User } from "./user.model";
import { Bill } from "./bill.model";
import { Reward } from "./reward.model";
export declare const repositoryProviders: ({
    provide: string;
    useValue: typeof User;
} | {
    provide: string;
    useValue: typeof Bill;
} | {
    provide: string;
    useValue: typeof Reward;
})[];
