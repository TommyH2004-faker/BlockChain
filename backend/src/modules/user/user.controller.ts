import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './user.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint GET /users/recipients
  @UseGuards(JwtAuthGuard)
  @Get('recipients')
  async getAllRecipients(@Request() req) {
    try {
      // Chỉ admin và issuer mới được lấy danh sách recipients
      const user = req.user;
      if (user.role !== 'admin' && user.role !== 'issuer') {
        return [];
      }

      // Lấy danh sách user có role = 'recipient'
      return await this.usersService.findAllRecipients();
    } catch (error) {
      console.error('Error fetching recipients:', error);
      throw error;
    }
  }
}
