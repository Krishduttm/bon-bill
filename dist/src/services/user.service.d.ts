import { User } from "../models/user.model";
export interface CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    creditCardNumber?: string;
}
export declare class UserService {
    private userRepository;
    private readonly logger;
    constructor(userRepository: typeof User);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User>;
}
