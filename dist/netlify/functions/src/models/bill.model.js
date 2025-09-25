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
let Bill = class Bill extends Model {
    // Method to check if bill was paid on time
    checkPaidOnTime() {
        if (!this.paidDate)
            return false;
        return this.paidDate <= this.dueDate;
    }
};
__decorate([
    PrimaryKey,
    AutoIncrement,
    Column(DataType.INTEGER),
    __metadata("design:type", Number)
], Bill.prototype, "id", void 0);
__decorate([
    ForeignKey(() => User),
    Column({
        type: DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Bill.prototype, "userId", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Bill.prototype, "amount", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Bill.prototype, "dueDate", void 0);
__decorate([
    Column({
        type: DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Bill.prototype, "paidDate", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isPaid", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Bill.prototype, "isPaidOnTime", void 0);
__decorate([
    Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Bill.prototype, "countedForReward", void 0);
__decorate([
    Column({
        type: DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Bill.prototype, "description", void 0);
__decorate([
    BelongsTo(() => User),
    __metadata("design:type", User)
], Bill.prototype, "user", void 0);
Bill = __decorate([
    Table({
        tableName: "bills",
        timestamps: true,
    })
], Bill);
export { Bill };
