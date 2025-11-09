import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    // Seed admin user if no users exist
    this.seedAdminUser();
  }

  private async seedAdminUser() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('1234567', 10);
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
      });
      await this.userRepository.save(adminUser);
      console.log('Admin user created with password: 1234567');
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    // Try to find user by username or email
    const user = await this.userRepository.findOne({ 
      where: [
        { username },
        { email: username } // Also check if the provided username is actually an email
      ]
    });
    
    console.log(`Login attempt for: ${username}`);
    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  // async login(credentials: { username: string; password: string }) {
  //   try {
  //     // Check if user provided a username
  //     if (!credentials.username) {
  //       throw new UnauthorizedException('Username is required');
  //     }
      
  //     // Check if user provided a password
  //     if (!credentials.password) {
  //       throw new UnauthorizedException('Password is required');
  //     }
      
  //     const user = await this.validateUser(credentials.username, credentials.password);
  //     if (!user) {
  //       // Check if the user exists with that username
  //       const userExists = await this.userRepository.findOne({ 
  //         where: [
  //           { username: credentials.username },
  //           { email: credentials.username }
  //         ]
  //       });
        
  //       if (!userExists) {
  //         throw new UnauthorizedException('User not found. Try "admin" with password "admin123"');
  //       } else {
  //         throw new UnauthorizedException('Invalid password');
  //       }
  //     }

  //     const payload = { username: user.username, sub: user.id, role: user.role };
  //     return {
  //       token: this.jwtService.sign(payload),
  //       user: {
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //         role: user.role,
  //       }
  //     };
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     throw error;
  //   }
  // }
async login(credentials: { username: string; password: string }) {
  try {
    const user = await this.validateUser(credentials.username, credentials.password);
    if (!user) {
      const userExists = await this.userRepository.findOne({ 
        where: [
          { username: credentials.username },
          { email: credentials.username }
        ]
      });
      
      if (!userExists) {
        throw new UnauthorizedException('User not found');
      } else {
        throw new UnauthorizedException('Invalid password');
      }
    }

    // FIX: Đổi 'sub' thành 'userId' để match với jwt.strategy.ts
    const payload = { 
      username: user.username, 
      userId: user.id,  // ĐỔI từ 'sub' thành 'userId'
      role: user.role 
    };
    
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

  async register(userData: { username: string; password: string; email: string; role: 'admin' | 'issuer' | 'user' }) {
    // Check if username or email exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });
    
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      role: userData.role,
    });

    const savedUser = await this.userRepository.save(newUser);
    
    const payload = { 
    username: savedUser.username, 
    userId: savedUser.id,  // ĐỔI từ 'sub' thành 'userId'
    role: savedUser.role 
  };
  const { password, ...userResult } = savedUser;
  
  return {
    token: this.jwtService.sign(payload),
    user: userResult,
  };
  }

  async getUserProfile(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async updateUserProfile(id: string, userData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If password is being updated, hash it
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Check if username or email is being changed and if it's already taken
    if (userData.username && userData.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    await this.userRepository.update(id, userData);
    return this.getUserProfile(id);
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}