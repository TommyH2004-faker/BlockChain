import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '2d4f5e61a8cd431fd64fbdc29074d969b05e924ee3d6673e1058c33a3a2220f2', // In production, use environment variable
    });
  }

  async validate(payload: any) {
    // Kiểm tra user có tồn tại trong database không
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    
    if (!user) {
      return null;
    }
    
    return { 
      userId: payload.sub, 
      username: payload.username,
      role: payload.role
    };
  }
}