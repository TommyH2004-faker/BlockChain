export declare class CertificateOnChainService {
    private provider;
    private contract;
    private signer;
    private initialized;
    constructor();
    private initialize;
    issueCertificate(recipient: string, title: string, description: string, issueDate: string): Promise<any>;
    getCertificate(certId: string): Promise<{
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
