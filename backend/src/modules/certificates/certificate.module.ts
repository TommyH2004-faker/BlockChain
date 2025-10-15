import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from 'src/entities/certificate.entity';
import { User } from 'src/entities/user.entity';
import { CertificateOnChainService } from '../blockchain/certificate.onchain.service';


import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Certificate, User])],
  providers: [CertificateOnChainService, CertificateService],
  controllers: [CertificateController],
  exports: [CertificateService]
})
export class CertificateModule {}
