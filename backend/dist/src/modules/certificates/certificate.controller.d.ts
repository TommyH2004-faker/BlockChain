import { CertificateService } from './certificate.service';
import { Certificate } from '../../common/entities/certificate.entity';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    getAllCertificates(req: any): Promise<Certificate[]>;
    getCertificateById(id: number): Promise<Certificate>;
    verifyCertificate(credentialID: string): Promise<{
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
    } | {
        verified: boolean;
        error: string;
    }>;
    createCertificate(req: any, certificateData: Partial<Certificate>): Promise<Certificate>;
    updateCertificate(req: any, id: number, certificateData: Partial<Certificate>): Promise<Certificate>;
    deleteCertificate(req: any, id: number): Promise<void>;
    uploadImage(req: any, id: number, file: Express.Multer.File): Promise<Certificate>;
    searchCertificates(query: string): Promise<Certificate[]>;
    issueOnBlockchain(body: {
        certId: number;
    }): Promise<{
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
