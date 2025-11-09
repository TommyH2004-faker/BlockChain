import { AuthService } from './auth.service';
import { User } from '../../common/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: {
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
    register(registerDto: {
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
    getProfile(req: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateDto: Partial<User>): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(req: any): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUserById(req: any, id: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(req: any, id: string, updateDto: Partial<User>): Promise<{
        id: string;
        username: string;
        email: string;
        role: "admin" | "issuer" | "user";
        blockchainAddress: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(req: any, id: string): Promise<void>;
}
