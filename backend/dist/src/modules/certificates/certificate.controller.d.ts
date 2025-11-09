import { CertificateService } from './certificate.service';
import { Certificate } from '../../common/entities/certificate.entity';
export declare class CertificateController {
    private readonly certificateService;
    constructor(certificateService: CertificateService);
    getAllCertificates(req: any): Promise<any>;
    createTestCertificate(req: any): Promise<Certificate>;
    getCertificateById(id: number): Promise<Certificate>;
    verify(id: string): Promise<{
        verified: boolean;
        data?: undefined;
    } | {
        verified: boolean;
        data: Certificate;
    }>;
    createCertificate(req: any, certificateData: Partial<Certificate>): Promise<Certificate>;
    getBlockchainCertificates(): Promise<({
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
        issuer: import("../../common/entities/user.entity").User;
        blockchainVerified: boolean;
        recipient: import("../../common/entities/user.entity").User;
        blockchainData?: undefined;
    })[]>;
    issueOnBlockchain(body: {
        certId: number;
    }): Promise<{
        success: boolean;
        message: string;
        certificateId: number;
        transactionHash: any;
    }>;
    updateCertificate(req: any, id: number, certificateData: Partial<Certificate>): Promise<{
        message: string;
        certificate: Certificate;
    }>;
    deleteCertificate(req: any, id: number): Promise<void>;
    uploadImage(req: any, id: number, file: Express.Multer.File): Promise<Certificate>;
    searchCertificates(query: string): Promise<Certificate[]>;
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
    verifyCertificateByTx(txId: string, req: any): Promise<{
        certificate: Certificate;
        message: string;
        verified: boolean;
    }>;
}
