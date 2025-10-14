import { CertificateOnChainService } from './certificate.onchain.service';
import { CertificateService } from './certificate.service';
import { Certificate } from './entities/certificate.entity';
export interface VerificationDetails {
    databaseVerified: boolean;
    certificateExists: boolean;
    verificationTime: string;
    blockchainVerified?: boolean;
    blockchainTxId?: string;
    blockchainError?: string;
    dataMatches?: {
        title: boolean;
        description: boolean;
        date: boolean;
    };
}
export interface VerificationResult {
    certificate?: any;
    verified: boolean;
    blockchainVerified?: boolean;
    blockchainData?: any;
    verificationDetails: VerificationDetails;
    error?: string;
    certificateExists?: boolean;
    errorDetails?: string;
}
export declare class CertificateController {
    private readonly certOnChainService;
    private readonly certificateService;
    constructor(certOnChainService: CertificateOnChainService, certificateService: CertificateService);
    getAllCertificates(req: any): Promise<Certificate[]>;
    getCertificateById(id: number): Promise<Certificate>;
    verifyCertificate(credentialID: string): Promise<VerificationResult>;
    createCertificate(req: any, certificateData: Partial<Certificate>): Promise<Certificate>;
    updateCertificate(req: any, id: number, certificateData: Partial<Certificate>): Promise<Certificate>;
    deleteCertificate(req: any, id: number): Promise<void>;
    uploadImage(req: any, id: number, file: Express.Multer.File): Promise<Certificate>;
    searchCertificates(query: string): Promise<Certificate[]>;
    issueOnBlockchain(req: any, body: {
        certId: number;
    }): Promise<{
        message: string;
        certificate: Certificate;
        blockchainTxId: any;
    }>;
    getBlockchainCertificate(txId: string): Promise<any>;
}
