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
            verifiedAt: string;
        } | {
            issuer: any;
            recipient: any;
            title: any;
            description: any;
            issueDate: any;
            verifiedAt: string;
            transactionHash?: undefined;
            blockNumber?: undefined;
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
    getBlockchainCertificate(certId: string): Promise<{
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        transactionHash: string;
        blockNumber: number;
        verifiedAt: string;
    } | {
        issuer: any;
        recipient: any;
        title: any;
        description: any;
        issueDate: any;
        verifiedAt: string;
        transactionHash?: undefined;
        blockNumber?: undefined;
    }>;
}
