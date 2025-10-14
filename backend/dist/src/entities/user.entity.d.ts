import { Certificate } from './certificate.entity';
export declare class User {
    id: string;
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'issuer' | 'user';
    createdAt: Date;
    updatedAt: Date;
    issuedCertificates: Certificate[];
    receivedCertificates: Certificate[];
}
