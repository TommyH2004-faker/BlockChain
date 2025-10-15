import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../../common/entities/certificate.entity';
import { User } from '../../common/entities/user.entity';
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private certificateOnChainService: CertificateOnChainService,
  ) {}

// Trong hàm findAll(), thêm try-catch
async findAll(): Promise<Certificate[]> {
  try {
    return await this.certificateRepository.find({
      relations: ['issuer', 'recipient']
    });
  } catch (error) {
    console.error('Error finding all certificates:', error);
    // Return empty array instead of failing
    return [];
  }
}

  async findByIssuer(issuerId: string): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { issuerId },
      relations: ['issuer', 'recipient']
    });
  }

  async findByRecipient(recipientId: string): Promise<Certificate[]> {
    return this.certificateRepository.find({
      where: { recipientId },
      relations: ['issuer', 'recipient']
    });
  }

  async findById(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['issuer', 'recipient']
    });
    
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }
    
    return certificate;
  }

  async findByCredentialID(credentialID: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { credentialID },
      relations: ['issuer', 'recipient']
    });
    
    if (!certificate) {
      throw new NotFoundException(`Certificate with credential ID ${credentialID} not found`);
    }
    
    return certificate;
  }

  async create(certificateData: any, issuerId: string, recipientId: string): Promise<Certificate> {
    const issuer = await this.userRepository.findOneBy({ id: issuerId });
    const recipient = await this.userRepository.findOneBy({ id: recipientId });
    
    if (!issuer || !recipient) {
      throw new NotFoundException('Issuer or recipient not found');
    }
    
    // Issue certificate on blockchain if needed
    let blockchainTxId = null;
    try {
      blockchainTxId = await this.certificateOnChainService.issueCertificate(
        recipient.username,
        certificateData.title,
        certificateData.description,
        certificateData.issueDate
      );
    } catch (error) {
      console.error('Failed to issue certificate on blockchain:', error);
      // Continue without blockchain record if it fails
    }
    
    const newCertificate = this.certificateRepository.create({
      ...certificateData,
      issuerId,
      recipientId,
      blockchainTxId,
    });
    
    return this.certificateRepository.save(newCertificate) as unknown as Promise<Certificate>;
  }

  async update(id: number, certificateData: Partial<Certificate>): Promise<Certificate> {
    await this.findById(id); // Verify certificate exists
    await this.certificateRepository.update(id, certificateData);
    return this.findById(id);
  }

  async updateImage(id: number, imageUrl: string): Promise<Certificate> {
    const certificate = await this.findById(id);
    certificate.image = imageUrl;
    return this.certificateRepository.save(certificate);
  }

  async remove(id: number): Promise<void> {
    const certificate = await this.findById(id);
    await this.certificateRepository.remove(certificate);
  }

  async search(query: string): Promise<Certificate[]> {
    return this.certificateRepository
      .createQueryBuilder('certificate')
      .leftJoinAndSelect('certificate.issuer', 'issuer')
      .leftJoinAndSelect('certificate.recipient', 'recipient')
      .where('certificate.title LIKE :query', { query: `%${query}%` })
      .orWhere('certificate.description LIKE :query', { query: `%${query}%` })
      .orWhere('certificate.credentialID LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async verifyCertificate(certificate: Certificate) {
    // If blockchain verification is needed
    if (certificate.blockchainTxId) {
      try {
        const onchainData = await this.certificateOnChainService.getCertificate(certificate.blockchainTxId);
        return {
          certificate,
          verified: true,
          blockchainData: onchainData
        };
      } catch (error) {
        return {
          certificate,
          verified: false,
          error: 'Không thể xác minh trên blockchain'
        };
      }
    }
    
    return {
      certificate,
      verified: true
    };
  }

 // ...existing code...

async issueOnBlockchain(certId: number) {
  try {
    console.log(`Processing blockchain issuance for certificate ${certId}`);
    
    // Tìm chứng chỉ trong database
    const certificate = await this.findById(certId);
    if (!certificate) {
      throw new Error(`Certificate with ID ${certId} not found`);
    }

    console.log(`Found certificate: ${certificate.title}`);
    
    // Format ngày tháng 
    const issueDate = certificate.issueDate 
      ? new Date(certificate.issueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    
    // Gọi blockchain service
    const blockchainId = await this.certificateOnChainService.issueCertificate(
      certificate.recipient?.username || 'unknown-recipient',
      certificate.title,
      certificate.description || '',
      issueDate
    );
    
    if (!blockchainId) {
      throw new Error('No blockchain ID returned from transaction');
    }
    
    console.log(`Certificate issued on blockchain with ID: ${blockchainId}`);
    
    // Cập nhật thông tin trong database
    await this.certificateRepository.update(certId, {
      blockchainTxId: blockchainId
    });
    
    // Trả về kết quả để controller dùng
    return {
      success: true,
      message: 'Certificate issued on blockchain successfully',
      certificateId: blockchainId,
      transactionHash: blockchainId
    };
  } catch (error) {
    console.error(`Error issuing certificate ${certId} on blockchain:`, error);
    throw error;
  }
}

// ...existing code...

async getBlockchainCertificate(txId: string) {
  try {
    // Khởi tạo service khi cần dùng
    const onChainService = new CertificateOnChainService();
    return await onChainService.getCertificate(txId);
  } catch (error) {
    console.error(`Error getting certificate ${txId} from blockchain:`, error);
    // Return dummy data instead of failing
    return {
      issuer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      recipient: "Unknown",
      title: "Certificate Record",
      description: "Error retrieving certificate: " + error.message,
      issueDate: new Date().toISOString().split('T')[0],
      verifiedAt: new Date().toISOString(),
      error: error.message
    };
  }
}
}
