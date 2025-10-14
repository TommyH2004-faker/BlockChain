import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { User } from './entities/user.entity';
import { CertificateOnChainService } from './certificate.onchain.service';
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
}
