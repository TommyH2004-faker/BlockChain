import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../common/entities/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    private seedAdminUser;
    validateUser(username: string, password: string): Promise<any>;
    login(credentials: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    }>;
    register(userData: {
        username: string;
        password: string;
        email: string;
        role: 'admin' | 'issuer' | 'user';
    }): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: "admin" | "issuer" | "user";
            blockchainAddress: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getUserProfile(id: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateUserProfile(id: string, userData: Partial<User>): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<void>;
}
