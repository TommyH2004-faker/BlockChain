import { Module } from '@nestjs/common';
import { CertificateOnChainService } from './certificate.onchain.service';

@Module({
  providers: [CertificateOnChainService],
  exports: [CertificateOnChainService]
})
export class BlockchainModule {}