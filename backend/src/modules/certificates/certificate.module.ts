import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../../common/entities/certificate.entity';  // Updated path
import { User } from '../../common/entities/user.entity';  // Updated path
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { UploadModule } from '../../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, User]),
    UploadModule
  ],
  providers: [
    CertificateOnChainService,
    CertificateService
  ],
  controllers: [CertificateController],
  exports: [CertificateService]
})
export class CertificateModule {}