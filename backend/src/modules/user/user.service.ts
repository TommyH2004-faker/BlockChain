import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity'; // ĐỔI đường dẫn

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllRecipients(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'username', 'email', 'role', 'blockchainAddress'],
        order: {
          username: 'ASC'
        }
      });

      console.log(`Found ${users.length} recipients`);
      return users;
    } catch (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'blockchainAddress']
    });
  }

  async updateBlockchainAddress(userId: string, address: string): Promise<User> {
    await this.userRepository.update(userId, {
      blockchainAddress: address
    });
    
    return this.findById(userId);
  }
}