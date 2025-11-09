import { Controller, Post, Body, Get, Query, Param, Put, Delete, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CertificateService } from './certificate.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Certificate } from '../../common/entities/certificate.entity';

@Controller('certificates')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService
  ) {}


@UseGuards(JwtAuthGuard)
@Get()
async getAllCertificates(@Request() req) {
    try {
        console.log('Getting certificates for user:', {
            userId: req.user.userId,
            role: req.user.role
        });
        
        let certificates;
        if (req.user.role === 'admin') {
            certificates = await this.certificateService.findAll();
        } else if (req.user.role === 'issuer') {
            certificates = await this.certificateService.findByIssuer(req.user.userId);
        } else {
            certificates = await this.certificateService.findByRecipient(req.user.userId);
        }
        
        console.log(`Found ${certificates.length} certificates`);
        return certificates;
    } catch (error) {
        console.error('Error getting certificates:', error);
        throw new BadRequestException(`Failed to get certificates: ${error.message}`);
    }
}
// Add this new endpoint to your controller
// @UseGuards(JwtAuthGuard)
// @Post('test')
// async createTestCertificate(@Request() req) {
//     try {
//         console.log('Creating test certificate...');
        
//         const testCertificate = {
//             title: 'Test Certificate',
//             description: 'Test Description',
//             issuerId: req.user.userId,
//             recipientId: req.user.userId, // For testing, using same user
//             issueDate: new Date().toISOString().split('T')[0],
//             credentialID: `TEST-${Date.now()}`
//         };

//         console.log('Test certificate data:', testCertificate);
        
//         const result = await this.certificateService.create(testCertificate);
//         console.log('Test certificate created:', result);
        
//         return result;
//     } catch (error) {
//         console.error('Error creating test certificate:', error);
//         throw new BadRequestException(`Test failed: ${error.message}`);
//     }
// }
@UseGuards(JwtAuthGuard)
@Post('test')
async createTestCertificate(@Request() req) {
  try {
    console.log('Creating test certificate...');
    
    const testCertificate = {
      title: 'Test Certificate',
      description: 'Test Description',
      issuerId: req.user.userId,
      recipientId: req.user.userId, // For testing, using same user
      issueDate: new Date(), // ✅ sửa ở đây
      credentialID: `TEST-${Date.now()}`
    };

    console.log('Test certificate data:', testCertificate);
    
    const result = await this.certificateService.create(testCertificate);
    console.log('Test certificate created:', result);
    
    return result;
  } catch (error) {
    console.error('Error creating test certificate:', error);
    throw new BadRequestException(`Test failed: ${error.message}`);
  }
}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCertificateById(@Param('id') id: number) {
    return this.certificateService.findById(id);
  }

  // @Get('verify/:credentialID')
  // async verifyCertificate(@Param('credentialID') credentialID: string) {
  //   try {
  //     const certificate = await this.certificateService.findByCredentialID(credentialID);
      
  //     // Blockchain verification is now handled by service layer
  //     if (!certificate.blockchainTxId) {
  //       throw new Error('Certificate has not been issued on blockchain');
  //     }
  //     return this.certificateService.verifyCertificate(certificate.blockchainTxId);
  //   } catch (error) {
  //     return {
  //       verified: false,
  //       error: 'Không tìm thấy chứng chỉ'
  //     };
  //   }
  // }
@Get('verify')
  async verify(@Query('id') id: string) {
    return this.certificateService.verifyCertificate(id);
  }
  //  @UseGuards(JwtAuthGuard)
  // @Post()
  // async createCertificate(@Request() req, @Body() certificateData: Partial<Certificate>) {
  //   try {
  //     // Validate required fields
  //     if (!certificateData.title) {
  //       throw new BadRequestException('Title is required');
  //     }

  //     if (!certificateData.recipientId) {
  //       throw new BadRequestException('Recipient ID is required');
  //     }

  //     // Set default values
  //     const certificate = {
  //       ...certificateData,
  //       issuerId: req.user.userId,
  //       issueDate: certificateData.issueDate || new Date().toISOString().split('T')[0],
  //       description: certificateData.description || '',
  //       credentialID: certificateData.credentialID || `CERT-${Date.now()}-${Math.random().toString(36).substring(7)}`
  //     };

  //     console.log('Creating certificate:', certificate);
      
  //     return await this.certificateService.create(certificate);
  //   } catch (error) {
  //     console.error('Error creating certificate:', error);
  //     throw new BadRequestException(`Failed to create certificate: ${error.message}`);
  //   }
  // }
  @UseGuards(JwtAuthGuard)
@Post()
async createCertificate(@Request() req, @Body() certificateData: Partial<Certificate>) {
    try {
        // Validate required fields
        if (!certificateData.title) {
            throw new BadRequestException('Title is required');
        }

        if (!certificateData.recipientId) {
            throw new BadRequestException('Recipient ID is required');
        }

        // Create certificate with issuer ID from authenticated user
        const certificate = await this.certificateService.create({
            ...certificateData,
            issuerId: req.user.userId
        });

        return certificate;
    } catch (error) {
        console.error('Create certificate error:', error);
        throw new BadRequestException(`Failed to create certificate: ${error.message}`);
    }
}
  @Get('blockchain')
    @UseGuards(JwtAuthGuard)
    async getBlockchainCertificates() {
        try {
            console.log('Fetching all blockchain certificates...');
            const certificates = await this.certificateService.getAllBlockchainCertificates();
            console.log(`Found ${certificates.length} blockchain certificates`);
            return certificates;
        } catch (error) {
            console.error('Error fetching blockchain certificates:', error);
            throw new BadRequestException(`Failed to fetch blockchain certificates: ${error.message}`);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('blockchain/issue')
    async issueOnBlockchain(@Body() body: { certId: number }) {
        try {
            console.log('Received blockchain issuance request for cert ID:', body.certId);
    
    // Get certificate first to ensure we have all required data
    const certificate = await this.certificateService.findById(body.certId);
    if (!certificate) {
      throw new BadRequestException('Certificate not found');
    }

    // Validate required fields for blockchain
    if (!certificate.title || !certificate.description) {
      throw new BadRequestException('Certificate must have title and description');
    }
    
    const result = await this.certificateService.issueOnBlockchain(body.certId);
    
    if (!result || !result.certificateId) {
      throw new BadRequestException('No certificate ID returned from blockchain');
    }
    
    console.log('Successfully issued certificate on blockchain:', result);
    
    return {
      success: true,
      message: 'Certificate issued on blockchain successfully',
      certificateId: result.certificateId,
      transactionHash: result.transactionHash || result.certificateId
    };
  } catch (error) {
    console.error('Error issuing certificate on blockchain:', error);
    throw new BadRequestException(
      `Failed to issue on blockchain: ${error.message}`
    );
  }
}
  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // async updateCertificate(
  //   @Request() req,
  //   @Param('id') id: number,
  //   @Body() certificateData: Partial<Certificate>
  // ) {
  //   const certificate = await this.certificateService.findById(id);
    
  //   // Chỉ admin và issuer của chứng chỉ mới được cập nhật
  //   if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
  //     throw new BadRequestException('Không có quyền cập nhật chứng chỉ');
  //   }
    
  //   return this.certificateService.update(id, certificateData);
  // }
@UseGuards(JwtAuthGuard)
@Put(':id')
async updateCertificate(
  @Request() req,
  @Param('id') id: number,
  @Body() certificateData: Partial<Certificate>
) {
  const certificate = await this.certificateService.findById(id);

  if (!certificate) {
    throw new NotFoundException('Certificate not found');
  }

  // ✅ Chỉ admin và chính issuer của chứng chỉ mới được sửa
  if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
    throw new ForbiddenException('Không có quyền cập nhật chứng chỉ');
  }

  // ✅ LOẠI BỎ các field không được phép update
  delete certificateData.issuerId;
  delete certificateData.recipientId;
  delete certificateData.issuer;
  delete certificateData.recipient;
  delete certificateData.blockchainVerified;
  delete certificateData.blockchainTxId;
  delete certificateData.createdAt;
  delete certificateData.updatedAt;

  // ✅ Update an toàn
  const updated = await this.certificateService.update(id, certificateData);

  return {
    message: 'Cập nhật thành công',
    certificate: updated,
  };
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCertificate(
    @Request() req,
    @Param('id') id: number
  ) {
    const certificate = await this.certificateService.findById(id);
    
    // Chỉ admin và issuer của chứng chỉ mới được xóa
    if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
      throw new BadRequestException('Không có quyền xóa chứng chỉ');
    }
    
    return this.certificateService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-image/:id')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Request() req,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const certificate = await this.certificateService.findById(id);
    
    // Chỉ admin và issuer của chứng chỉ mới được cập nhật ảnh
    if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
      throw new BadRequestException('Không có quyền cập nhật ảnh chứng chỉ');
    }
    
    // Xử lý file image và lưu đường dẫn
    if (!file) {
      throw new BadRequestException('Không tìm thấy file ảnh');
    }
    
    // Đối với demo này, ta sẽ lưu trực tiếp ảnh dạng base64 vào database
    // Trong thực tế, nên lưu ảnh lên cloud storage và chỉ lưu đường dẫn vào database
    const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    return this.certificateService.updateImage(id, imageBase64);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchCertificates(@Query('query') query: string) {
    if (!query) {
      return [];
    }
    return this.certificateService.search(query);
  }

  
  

  @Get('blockchain/:txId')
  async getBlockchainCertificate(@Param('txId') txId: string) {
    try {
      const cert = await this.certificateService.getBlockchainCertificate(txId);
      return cert;
    } catch (error) {
      throw new BadRequestException(`Lỗi khi lấy chứng chỉ từ blockchain: ${error.message}`);
    }
  }
//  @UseGuards(JwtAuthGuard)
//   @Post('verify/blockchain/:txId')
//   async verifyCertificateByTx(@Param('txId') txId: string, @Request() req) {
//     const user = req.user; // { userId, username, role }
//     console.log(`[VERIFY] User ${user.username} (${user.role}) requested verification for txId: ${txId}`);

//     try {
//       // 1️⃣ Find certificate in DB by blockchainTxId
//       const cert = await this.certificateService.findByBlockchainTxId(txId);
//       if (!cert) {
//         console.warn(`[VERIFY] Certificate not found for txId: ${txId}`);
//         throw new NotFoundException('Certificate not found');
//       }

//       // 2️⃣ Check permission: chỉ admin hoặc issuer mới được phép
// if (user.role !== 'admin' && user.role !== 'issuer') {
//   console.warn(`[VERIFY] User ${user.username} (${user.role}) is not allowed to verify certificate ID ${cert.id}`);
//   throw new ForbiddenException('You are not allowed to verify this certificate');
// }


//       // 3️⃣ Check if already verified
//       if (cert.blockchainVerified) {
//         console.log(`[VERIFY] Certificate ID ${cert.id} already verified`);
//         return { certificate: cert, message: 'Certificate has already been verified', verified: true };
//       }

//       // 4️⃣ Update certificate as verified
//       cert.blockchainVerified = true;
//       await this.certificateService.updateCertificate(cert.id, { blockchainVerified: true });

//       console.log(`[VERIFY] Certificate ID ${cert.id} verified successfully`);
//       return { certificate: cert, message: 'Certificate successfully verified', verified: true };

//     } catch (error) {
//       console.error(`[VERIFY] Error verifying certificate txId ${txId}:`, error);
//       if (error instanceof NotFoundException || error instanceof ForbiddenException) {
//         throw error; // pass through known exceptions
//       }
//       throw new InternalServerErrorException('Failed to verify certificate');
//     }
//   }
@UseGuards(JwtAuthGuard)
@Post('verify/blockchain/:txId')
async verifyCertificateByTx(@Param('txId') txId: string, @Request() req) {
  const user = req.user; // { userId, username, role }
  console.log(`[VERIFY] User ${user.username} (${user.role}) requested verification for txId: ${txId}`);

  try {
    // 1️⃣ Tìm certificate trong DB theo blockchainTxId
    const cert = await this.certificateService.findByBlockchainTxId(txId);
    if (!cert) {
      console.warn(`[VERIFY] Certificate not found for txId: ${txId}`);
      throw new NotFoundException('Certificate not found');
    }

    // 2️⃣ Kiểm tra quyền: chỉ admin hoặc issuer mới được phép
    if (user.role !== 'admin' && user.role !== 'issuer') {
      console.warn(`[VERIFY] User ${user.username} (${user.role}) is not allowed to verify certificate ID ${cert.id}`);
      throw new ForbiddenException('You are not allowed to verify this certificate');
    }

    // 3️⃣ Kiểm tra đã verify chưa
    if (cert.blockchainVerified) {
      console.log(`[VERIFY] Certificate ID ${cert.id} already verified`);
      return { certificate: cert, message: 'Certificate has already been verified', verified: true };
    }

    // 4️⃣ Tính expiryDate = issueDate + 5 năm
    const issueDate = new Date(cert.issueDate);
    const expiryDate = new Date(issueDate);
    expiryDate.setFullYear(issueDate.getFullYear() + 5);

    // 5️⃣ Cập nhật certificate: blockchainVerified và expiryDate
    cert.blockchainVerified = true;
    cert.expiryDate = expiryDate; // hoặc tuỳ DB định dạng
    await this.certificateService.updateCertificate(cert.id, {
      blockchainVerified: true,
      expiryDate: cert.expiryDate,
    });

    console.log(`[VERIFY] Certificate ID ${cert.id} verified successfully`);
    return { certificate: cert, message: 'Certificate successfully verified', verified: true };

  } catch (error) {
    console.error(`[VERIFY] Error verifying certificate txId ${txId}:`, error);
    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error; // pass through known exceptions
    }
    throw new InternalServerErrorException('Failed to verify certificate');
  }
}

}