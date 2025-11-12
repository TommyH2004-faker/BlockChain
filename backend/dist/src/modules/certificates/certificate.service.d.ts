import { Repository } from 'typeorm';
import { Certificate } from '../../common/entities/certificate.entity';
import { User } from '../../common/entities/user.entity';
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';
export declare class CertificateService {
    private certificateRepository;
    private userRepository;
    private certificateOnChainService;
    constructor(certificateRepository: Repository<Certificate>, userRepository: Repository<User>, certificateOnChainService: CertificateOnChainService);
    findAll(): Promise<Certificate[]>;
    findByIssuer(issuerId: string): Promise<Certificate[]>;
    findByRecipient(recipientId: string): Promise<Certificate[]>;
    findById(id: number): Promise<Certificate>;
    findByCredentialID(credentialID: string): Promise<Certificate>;
    create(certificateData: Partial<Certificate>): Promise<Certificate>;
    update(id: number, certificateData: Partial<Certificate>): Promise<Certificate>;
    updateImage(id: number, imageUrl: string): Promise<Certificate>;
    remove(id: number): Promise<void>;
    search(query: string): Promise<Certificate[]>;
    issueOnBlockchain(certId: number): Promise<{
        success: boolean;
        message: string;
        certificateId: number;
        transactionHash: any;
    }>;
    getAllBlockchainCertificates(): Promise<({
        id: number;
        title: string;
        description: string;
        issueDate: Date;
        issuer: {
            id: string;
            username: string;
            blockchainAddress: string;
        };
        recipient: {
            id: string;
            username: string;
            blockchainAddress: string;
        };
        blockchainTxId: string;
        blockchainData: {
            status: string;
            issueDate: string;
            title: string;
            transactionHash: string;
            blockNumber: number;
        };
    } | {
        blockchainError: any;
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
        blockchainData?: undefined;
    })[]>;
    getBlockchainCertificate(txId: string): Promise<{
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        transactionHash: string;
        blockNumber: number;
        status: string;
        verifiedAt: string;
        certificateId?: undefined;
        error?: undefined;
    } | {
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        transactionHash: string;
        verifiedAt: string;
        blockNumber?: undefined;
        status?: undefined;
        certificateId?: undefined;
        error?: undefined;
    } | {
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        verifiedAt: string;
        certificateId: string;
        transactionHash?: undefined;
        blockNumber?: undefined;
        status?: undefined;
        error?: undefined;
    } | {
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        verifiedAt: string;
        error: any;
        transactionHash?: undefined;
        blockNumber?: undefined;
        status?: undefined;
        certificateId?: undefined;
    }>;
    verifyCertificate(certIdOrTx: string): Promise<{
        verified: boolean;
        data?: undefined;
    } | {
        verified: boolean;
        data: Certificate;
    }>;
    findByBlockchainTxId(txId: string): Promise<Certificate | null>;
    updateCertificate(id: number, updateData: Partial<Certificate>): Promise<Certificate>;
}
