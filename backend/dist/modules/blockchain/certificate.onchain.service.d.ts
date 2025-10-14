export declare class CertificateOnChainService {
    private provider;
    private contract;
    private signer;
    constructor();
    testContractConnection(): Promise<void>;
    issueCertificate(recipient: string, title: string, description: string, issueDate: string): Promise<any>;
    getCertificate(certId: string): Promise<{
        issuer: string;
        recipient: string;
        title: string;
        description: string;
        issueDate: string;
        verifiedAt: string;
        blockNumber: number;
        transactionHash: string;
    } | {
        issuer: any;
        recipient: any;
        title: any;
        description: any;
        issueDate: any;
        verifiedAt: string;
        blockNumber?: undefined;
        transactionHash?: undefined;
    }>;
}
