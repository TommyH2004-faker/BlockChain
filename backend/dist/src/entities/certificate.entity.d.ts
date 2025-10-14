import { User } from './user.entity';
export declare class Certificate {
    id: number;
    title: string;
    description: string;
    issueDate: string;
    expiryDate: string;
    grade: string;
    type: string;
    credentialID: string;
    image: string;
    blockchainTxId: string;
    blockchainVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    issuer: User;
    issuerId: string;
    recipient: User;
    recipientId: string;
}
