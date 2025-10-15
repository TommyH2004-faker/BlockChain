import { Controller, Post, Body, Get, Query, Param, Put, Delete, UseGuards, Request, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
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
    console.log('Getting all certificates...');
    
    if (req.user.role === 'admin') {
      const certificates = await this.certificateService.findAll();
      return certificates;
    }
    
    if (req.user.role === 'issuer') {
      return await this.certificateService.findByIssuer(req.user.id);
    }
    
    return await this.certificateService.findByRecipient(req.user.id);
  } catch (error) {
    console.error('Error in getAllCertificates:', error);
    // Return empty array instead of failing
    return [];
  }
}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCertificateById(@Param('id') id: number) {
    return this.certificateService.findById(id);
  }

  @Get('verify/:credentialID')
  async verifyCertificate(@Param('credentialID') credentialID: string) {
    try {
      const certificate = await this.certificateService.findByCredentialID(credentialID);
      
      // Blockchain verification is now handled by service layer
      return this.certificateService.verifyCertificate(certificate);
    } catch (error) {
      return {
        verified: false,
        error: 'Không tìm thấy chứng chỉ'
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCertificate(
    @Request() req,
    @Body() certificateData: Partial<Certificate>
  ) {
    // Chỉ admin và issuer mới được tạo chứng chỉ
    if (req.user.role !== 'admin' && req.user.role !== 'issuer') {
      throw new BadRequestException('Không có quyền tạo chứng chỉ');
    }
    
    // Tạo credential ID tự động nếu không có
    if (!certificateData.credentialID) {
      certificateData.credentialID = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    return this.certificateService.create(
      certificateData,
      req.user.userId,  // issuer ID
      certificateData.recipientId // recipient ID phải được truyền vào
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCertificate(
    @Request() req,
    @Param('id') id: number,
    @Body() certificateData: Partial<Certificate>
  ) {
    const certificate = await this.certificateService.findById(id);
    
    // Chỉ admin và issuer của chứng chỉ mới được cập nhật
    if (req.user.role !== 'admin' && certificate.issuerId !== req.user.userId) {
      throw new BadRequestException('Không có quyền cập nhật chứng chỉ');
    }
    
    return this.certificateService.update(id, certificateData);
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

  // ...existing code...
@UseGuards(JwtAuthGuard)
@Post('blockchain/issue')
async issueOnBlockchain(@Body() body: { certId: number }) {
  try {
    console.log('Received blockchain issuance request for cert ID:', body.certId);
    
    // Gọi service để lưu lên blockchain
    const result = await this.certificateService.issueOnBlockchain(body.certId);
    
    // Ensure we have blockchainCertId in result
    if (!result || !result.certificateId) {
      console.error('No certificate ID returned from blockchain service');
      throw new BadRequestException('Không nhận được ID giao dịch từ blockchain');
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
    throw new BadRequestException(`Lỗi khi lưu chứng chỉ lên blockchain: ${error.message}`);
  }
}
// ...existing code...
  

  @Get('blockchain/:txId')
  async getBlockchainCertificate(@Param('txId') txId: string) {
    try {
      const cert = await this.certificateService.getBlockchainCertificate(txId);
      return cert;
    } catch (error) {
      throw new BadRequestException(`Lỗi khi lấy chứng chỉ từ blockchain: ${error.message}`);
    }
  }
}