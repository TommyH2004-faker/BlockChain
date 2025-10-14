export declare class CertificateOnChainService {
    private provider;
    private contract;
    private signer;
    constructor();
    private testContractConnection;
    issueCertificate(recipient: string, title: string, description: string, issueDate: string): Promise<any>;
    getCertificate(certId: string): Promise<{
        issuer: any;
        recipient: any;
        title: any;
        description: any;
        issueDate: any;
        verifiedAt: string;
        recipientIsAddress: boolean;
    }>;
}
