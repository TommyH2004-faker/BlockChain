import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';

import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { SecurityModule } from './modules/security/security.module';
import { User } from './common/entities/user.entity';
import { Certificate } from './common/entities/certificate.entity';
import { DataSource } from 'typeorm/data-source/DataSource';
import { DebugController } from './debug.controller';
import { CertificateModule } from './modules/certificates/certificate.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'spring_04',
      password: 'spring04', // Thay thế bằng mật khẩu MySQL của bạn
      database: 'blockchain',
      entities: [User, Certificate],
      synchronize: true, // Chỉ sử dụng cho development, không dùng trong production
    }),
    SecurityModule,
    AuthModule,
    CertificateModule,
    BlockchainModule
  ],
  controllers: [DebugController],
})
export class AppModule {}
