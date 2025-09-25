import {
  Injectable,
  Inject,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { User } from "../models/user.model";
import { Bill } from "../models/bill.model";
import { Reward } from "../models/reward.model";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  creditCardNumber?: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject("USER_REPOSITORY")
    private userRepository: typeof User
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Creating user with email: ${createUserDto.email}`);

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        this.logger.warn(
          `User with email ${createUserDto.email} already exists`
        );
        throw new Error(
          `User with email ${createUserDto.email} already exists`
        );
      }

      const user = await this.userRepository.create(createUserDto);
      this.logger.log(`Successfully created user with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      if (error.message.includes("already exists")) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create user: ${error.message}`
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.log("Fetching all users");
      const users = await this.userRepository.findAll({
        include: [Bill, Reward],
      });
      this.logger.log(`Successfully fetched ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        `Failed to fetch users: ${error.message}`
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);

      if (!id || id <= 0) {
        throw new Error("Invalid user ID provided");
      }

      const user = await this.userRepository.findByPk(id, {
        include: [
          {
            model: Bill,
            order: [["dueDate", "DESC"]],
          },
          Reward,
        ],
      });

      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      this.logger.log(`Successfully fetched user: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user with ID ${id}: ${error.message}`,
        error.stack
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch user: ${error.message}`
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      this.logger.log(`Fetching user by email: ${email}`);

      if (!email || !email.includes("@")) {
        throw new Error("Invalid email format provided");
      }

      const user = await this.userRepository.findOne({
        where: { email },
        include: [Bill, Reward],
      });

      if (user) {
        this.logger.log(`Successfully found user with email: ${email}`);
      } else {
        this.logger.log(`No user found with email: ${email}`);
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user by email ${email}: ${error.message}`,
        error.stack
      );
      if (error.message.includes("Invalid email")) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to fetch user by email: ${error.message}`
      );
    }
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>
  ): Promise<User> {
    try {
      this.logger.log(`Updating user with ID: ${id}`);

      if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
        throw new Error("No update data provided");
      }

      // Check if email is being updated and already exists
      if (updateUserDto.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser && existingUser.id !== id) {
          throw new Error(
            `Email ${updateUserDto.email} is already in use by another user`
          );
        }
      }

      const user = await this.findOne(id);
      const updatedUser = await user.update(updateUserDto);
      this.logger.log(`Successfully updated user with ID: ${id}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID ${id}: ${error.message}`,
        error.stack
      );
      if (
        error instanceof NotFoundException ||
        error.message.includes("already in use") ||
        error.message.includes("No update data")
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update user: ${error.message}`
      );
    }
  }
}
