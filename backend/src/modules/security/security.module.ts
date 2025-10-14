import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../../common/entities/user.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '2d4f5e61a8cd431fd64fbdc29074d969b05e924ee3d6673e1058c33a3a2220f2',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class SecurityModule {}