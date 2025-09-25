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

export enum RewardType {
  AMAZON_GIFT_CARD = "AMAZON_GIFT_CARD",
  STARBUCKS_GIFT_CARD = "STARBUCKS_GIFT_CARD",
  TARGET_GIFT_CARD = "TARGET_GIFT_CARD",
  CASH_BACK = "CASH_BACK",
}

@Table({
  tableName: "rewards",
  timestamps: true,
})
export class Reward extends Model<Reward> {
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
    type: DataType.ENUM(...Object.values(RewardType)),
    allowNull: false,
  })
  type: RewardType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  value: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  giftCardCode: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  earnedDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRedeemed: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  redeemedDate: Date;

  @BelongsTo(() => User)
  user: User;
}
