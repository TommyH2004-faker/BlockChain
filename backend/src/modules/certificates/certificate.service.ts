import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Certificate } from '../../common/entities/certificate.entity';
import { User } from '../../common/entities/user.entity';
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';
import { BlockchainCertificateData } from 'src/util/BlockDataCer';

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
// async findAll(): Promise<Certificate[]> {
//     try {
//         console.log('Attempting to fetch all certificates...');
        
//         const certificates = await this.certificateRepository.find({
//             relations: ['issuer', 'recipient']
//         });
        
//         console.log('Found certificates:', {
//             count: certificates.length,
//             certificates: certificates.map(c => ({
//                 id: c.id,
//                 title: c.title,
//                 issuer: c.issuer?.username,
//                 recipient: c.recipient?.username
//             }))
//         });
        
//         return certificates;
//     } catch (error) {
//         console.error('Error fetching certificates:', error);
//         throw error;
//     }
// }
async findAll(): Promise<Certificate[]> {
    try {
        console.log('Attempting to fetch all certificates from database...');
        
        // Check if repository is properly injected
        if (!this.certificateRepository) {
            console.error('Certificate repository is not properly injected');
            throw new Error('Database connection error');
        }

        const certificates = await this.certificateRepository.find({
            relations: ['issuer', 'recipient']
        });
        
        console.log('Database query result:', {
            success: true,
            count: certificates.length,
            certificates: certificates.map(c => ({
                id: c.id,
                title: c.title,
                issuerId: c.issuerId,
                recipientId: c.recipientId
            }))
        });

        return certificates;
    } catch (error) {
        console.error('Error in findAll certificates:', error);
        throw new Error(`Database error: ${error.message}`);
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

  async create(certificateData: Partial<Certificate>): Promise<Certificate> {
    try {
      const certificate = this.certificateRepository.create(certificateData);
      return await this.certificateRepository.save(certificate);
    } catch (error) {
      console.error('Error creating certificate:', error);
      throw new BadRequestException(`Database error: ${error.message}`);
    }
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

//   async verifyCertificate(txHash: string) {
//   try {
//     console.log(`Verifying certificate with txHash: ${txHash}`);
    
//     // Tìm certificate trong database bằng txHash
//     const certificate = await this.certificateRepository.findOne({
//       where: { blockchainTxId: txHash },
//       relations: ['issuer', 'recipient']
//     });

//     // Lấy thông tin từ blockchain
//     const onChainService = new CertificateOnChainService();
//     const blockchainData = await onChainService.getCertificate(txHash);

//     console.log('Database certificate:', certificate);
//     console.log('Blockchain data:', blockchainData);

//     // Nếu không tìm thấy trong database nhưng có trên blockchain
//     if (!certificate && blockchainData) {
//       return {
//         verified: true,
//         source: 'blockchain',
//         data: blockchainData
//       };
//     }

//     // Nếu tìm thấy cả hai
//     if (certificate && blockchainData) {
//       return {
//         verified: true,
//         source: 'both',
//         data: {
//           ...certificate,
//           blockchain: blockchainData
//         }
//       };
//     }

//     throw new Error('Certificate not found');
//   } catch (error) {
//     console.error('Verification error:', error);
//     throw error;
//   }
// }

// async issueOnBlockchain(certId: number) {
//   try {
//     console.log(`Processing blockchain issuance for certificate ${certId}`);
    
//     // Tìm chứng chỉ trong database
//     const certificate = await this.findById(certId);
//     if (!certificate) {
//       throw new Error(`Certificate with ID ${certId} not found`);
//     }

//     console.log(`Found certificate: ${certificate.title}`);
    
//     // Format ngày tháng 
//     const issueDate = certificate.issueDate 
//       ? new Date(certificate.issueDate).toISOString().split('T')[0]
//       : new Date().toISOString().split('T')[0];
    
//     // Gọi blockchain service
//     const blockchainId = await this.certificateOnChainService.issueCertificate(
//       certificate.recipient?.username || 'unknown-recipient',
//       certificate.title,
//       certificate.description || '',
//       issueDate
//     );
    
//     if (!blockchainId) {
//       throw new Error('No blockchain ID returned from transaction');
//     }
    
//     console.log(`Certificate issued on blockchain with ID: ${blockchainId}`);
    
//     // Cập nhật thông tin trong database
//     await this.certificateRepository.update(certId, {
//       blockchainTxId: blockchainId.transactionHash
//     });
    
//     // Trả về kết quả để controller dùng
//     return {
//       success: true,
//       message: 'Certificate issued on blockchain successfully',
//       certificateId: blockchainId,
//       transactionHash: blockchainId
//     };
//   } catch (error) {
//     console.error(`Error issuing certificate ${certId} on blockchain:`, error);
//     throw error;
//   }
// }


async issueOnBlockchain(certId: number) {
  try {
    console.log(`Processing blockchain issuance for certificate ${certId}`);
    
    const certificate = await this.findById(certId);
    if (!certificate) {
      throw new Error(`Certificate with ID ${certId} not found`);
    }

    const issueDate = certificate.issueDate 
      ? new Date(certificate.issueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // 🧩 Gọi blockchain service
    const blockchainResponse = await this.certificateOnChainService.issueCertificate(
      certificate.recipient?.username || 'unknown-recipient',
      certificate.title,
      certificate.description || '',
      issueDate
    );

    // Nếu blockchainResponse là chuỗi hash
    const txHash = typeof blockchainResponse === 'string'
      ? blockchainResponse
      : blockchainResponse.transactionHash;

    if (!txHash) throw new Error('Blockchain transaction hash not found');

    console.log(`✅ Certificate issued on blockchain with txHash: ${txHash}`);

    // ✅ Cập nhật DB
    await this.certificateRepository.update(certId, {
      blockchainTxId: txHash,
    });

    return {
      success: true,
      message: 'Certificate issued on blockchain successfully',
      certificateId: certId,
      transactionHash: txHash,
    };
  } catch (error) {
    console.error(`❌ Error issuing certificate ${certId} on blockchain:`, error);
    throw new Error(`Lỗi blockchain: Failed to issue on blockchain: ${error.message}`);
  }
}

async getAllBlockchainCertificates() {
    try {
        const certificates = await this.certificateRepository.find({
            where: {
                blockchainTxId: Not(IsNull())
            },
            relations: ['issuer', 'recipient']
        });

        const blockchainCertificates = await Promise.all(
            certificates.map(async (cert) => {
                try {
                    const blockchainData = await this.certificateOnChainService.getCertificate(cert.blockchainTxId) as BlockchainCertificateData;
                    return {
                        id: cert.id,
                        title: cert.title,
                        description: cert.description,
                        issueDate: cert.issueDate,
                        issuer: {
                            id: cert.issuer.id,
                            username: cert.issuer.username,
                            blockchainAddress: blockchainData.issuer
                        },
                        recipient: {
                            id: cert.recipient.id,
                            username: cert.recipient.username,
                            blockchainAddress: blockchainData.recipient
                        },
                        blockchainTxId: cert.blockchainTxId,
                        blockchainData: {
                            status: blockchainData.status || 'VERIFIED',
                            issueDate: blockchainData.issueDate,
                            title: blockchainData.title,
                            transactionHash: blockchainData.transactionHash,
                            blockNumber: blockchainData.blockNumber
                        }
                    };
                } catch (error) {
                    console.error(`Error fetching blockchain data for certificate ${cert.id}:`, error);
                    return {
                        ...cert,
                        blockchainError: error.message
                    };
                }
            })
        );

        return blockchainCertificates;
    } catch (error) {
        console.error('Error in getAllBlockchainCertificates:', error);
        throw new Error(`Failed to fetch blockchain certificates: ${error.message}`);
    }
}

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
 async verifyCertificate(certIdOrTx: string) {
    const cert = await this.certificateRepository.findOne({
      where: [
        { credentialID: certIdOrTx },
        { blockchainTxId: certIdOrTx },
      ],
    });

    if (!cert) return { verified: false };

    return {
      verified: true,
      data: cert,
    };
  }



  /**
   * Find certificate by blockchain transaction hash
   */
  async findByBlockchainTxId(txId: string): Promise<Certificate | null> {
    return this.certificateRepository.findOne({ where: { blockchainTxId: txId } });
  }

  /**
   * Update certificate by id
   * @param id - certificate id
   * @param updateData - partial fields to update
   */
  async updateCertificate(id: number, updateData: Partial<Certificate>): Promise<Certificate> {
    const cert = await this.findById(id);
    if (!cert) {
      throw new NotFoundException(`Certificate with id ${id} not found`);
    }

    // Merge existing certificate with updated fields
    const updatedCert = this.certificateRepository.merge(cert, updateData);

    // Save updated certificate
    return this.certificateRepository.save(updatedCert);
  }
}
