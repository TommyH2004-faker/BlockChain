import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';


@Controller('debug')
export class DebugController {
  @UseGuards(JwtAuthGuard)
  @Get('auth')
  async debugAuth(@Request() req) {
    console.log('Debug auth endpoint accessed by:', req.user);
    return {
      message: 'Authentication successful',
      user: req.user
    };
  }
  
  @Get('public')
  async debugPublic() {
    console.log('Debug public endpoint accessed');
    return {
      message: 'Public endpoint successful',
      timestamp: new Date().toISOString()
    };
  }
}