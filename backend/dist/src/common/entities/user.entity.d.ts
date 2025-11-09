export declare class User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'issuer' | 'user';
    blockchainAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
