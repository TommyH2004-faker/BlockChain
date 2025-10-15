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
    create(certificateData: any, issuerId: string, recipientId: string): Promise<Certificate>;
    update(id: number, certificateData: Partial<Certificate>): Promise<Certificate>;
    updateImage(id: number, imageUrl: string): Promise<Certificate>;
    remove(id: number): Promise<void>;
    search(query: string): Promise<Certificate[]>;
    verifyCertificate(certificate: Certificate): Promise<{
        certificate: Certificate;
        verified: boolean;
        blockchainData: {
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
        };
        error?: undefined;
    } | {
        certificate: Certificate;
        verified: boolean;
        error: string;
        blockchainData?: undefined;
    } | {
        certificate: Certificate;
        verified: boolean;
        blockchainData?: undefined;
        error?: undefined;
    }>;
    issueOnBlockchain(certId: number): Promise<{
        success: boolean;
        message: string;
        certificateId: any;
        transactionHash: any;
    }>;
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
}
