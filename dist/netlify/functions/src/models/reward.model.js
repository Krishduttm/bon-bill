var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, } from "sequelize-typescript";
import { User } from "./user.model";
export var RewardType;
(function (RewardType) {
    RewardType["AMAZON_GIFT_CARD"] = "AMAZON_GIFT_CARD";
    RewardType["STARBUCKS_GIFT_CARD"] = "STARBUCKS_GIFT_CARD";
    RewardType["TARGET_GIFT_CARD"] = "TARGET_GIFT_CARD";
    RewardType["CASH_BACK"] = "CASH_BACK";
})(RewardType || (RewardType = {}));
let Reward = class Reward extends Model {
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column(DataType.INTEGER),
    __metadata("design:type", Number)
], Reward.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Reward.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.ENUM(...Object.values(RewardType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Reward.prototype, "type", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Reward.prototype, "value", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Reward.prototype, "description", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Reward.prototype, "giftCardCode", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    }),
    __metadata("design:type", Date)
], Reward.prototype, "earnedDate", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Reward.prototype, "isRedeemed", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Reward.prototype, "redeemedDate", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], Reward.prototype, "user", void 0);
Reward = __decorate([
    Table({
        tableName: "rewards",
        timestamps: true,
    })
], Reward);
export { Reward };
