import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { Certificate } from '../../common/entities/certificate.entity';
import { User } from '../../common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, User]),
    BlockchainModule
  ],
  providers: [CertificateService],
  controllers: [CertificateController],
  exports: [CertificateService]
})
export class CertificateModule {}