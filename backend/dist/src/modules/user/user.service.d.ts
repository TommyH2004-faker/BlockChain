import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAllRecipients(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    updateBlockchainAddress(userId: string, address: string): Promise<User>;
}
