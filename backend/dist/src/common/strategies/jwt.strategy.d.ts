import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: any): Promise<{
        userId: any;
        username: any;
        role: any;
    }>;
}
export {};
