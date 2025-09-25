import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({
  tableName: "bills",
  timestamps: true,
})
export class Bill extends Model<Bill> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paidDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPaid: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPaidOnTime: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  countedForReward: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @BelongsTo(() => User)
  user: User;

  // Method to check if bill was paid on time
  checkPaidOnTime(): boolean {
    if (!this.paidDate) return false;
    return this.paidDate <= this.dueDate;
  }
}
