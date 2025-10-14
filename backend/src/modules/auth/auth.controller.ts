import { Controller, Post, Get, Put, Delete, Body, UseGuards, Request, Param, ForbiddenException, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: { username: string; password: string; email: string; role: 'admin' | 'issuer' | 'user' },
  ) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateDto: Partial<User>
  ) {
    return this.authService.updateUserProfile(req.user.userId, updateDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers(@Request() req) {
    // Chỉ admin mới được xem danh sách người dùng
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Không có quyền truy cập');
    }
    return this.authService.getAllUsers();
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(
    @Request() req,
    @Param('id') id: string
  ) {
    // Admin có thể xem tất cả người dùng, người dùng khác chỉ xem được thông tin của chính họ
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('Không có quyền truy cập');
    }
    return this.authService.getUserProfile(id);
  }
  
  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: Partial<User>
  ) {
    // Admin có thể cập nhật tất cả người dùng, người dùng khác chỉ cập nhật được thông tin của chính họ
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      throw new ForbiddenException('Không có quyền truy cập');
    }
    
    // Chỉ admin mới được cập nhật role
    if (updateDto.role && req.user.role !== 'admin') {
      delete updateDto.role;
    }
    
    return this.authService.updateUserProfile(id, updateDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(
    @Request() req,
    @Param('id') id: string
  ) {
    // Chỉ admin mới được xóa người dùng
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Không có quyền truy cập');
    }
    return this.authService.deleteUser(id);
  }
}