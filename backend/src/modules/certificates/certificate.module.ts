import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from '../../common/entities/certificate.entity';  // Updated path
import { User } from '../../common/entities/user.entity';  // Updated path
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, User])
  ],
  providers: [
    CertificateOnChainService,
    CertificateService
  ],
  controllers: [CertificateController],
  exports: [CertificateService]
})
export class CertificateModule {}