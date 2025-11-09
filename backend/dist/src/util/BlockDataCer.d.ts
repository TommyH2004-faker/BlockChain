export interface BlockchainCertificateData {
    issuer: string;
    recipient: string;
    title: string;
    description: string;
    issueDate: string;
    transactionHash?: string;
    blockNumber?: number;
    status?: string;
    verifiedAt?: string;
    certificateId?: string;
    error?: string;
}
