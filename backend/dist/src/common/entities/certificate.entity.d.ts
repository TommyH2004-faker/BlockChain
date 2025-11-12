import { User } from './user.entity';
export declare class Certificate {
    id: number;
    title: string;
    description: string;
    credentialID: string;
    issueDate: Date;
    expiryDate: Date;
    grade: string;
    type: string;
    image: string;
    blockchainTxId: string;
    blockchainCertId: string;
    createdAt: Date;
    updatedAt: Date;
    issuerId: string;
    recipientId: string;
    issuer: User;
    blockchainVerified: boolean;
    recipient: User;
}
