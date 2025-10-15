import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Override the canActivate method to add debugging
  canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('JWT Auth Guard - Headers:', req.headers);
    console.log('JWT Auth Guard - Authorization Header:', req.headers.authorization);
    
    return super.canActivate(context);
  }
  
  // Override the handleRequest to catch JWT validation errors
  handleRequest(err: any, user: any, info: any, context: any) {
    console.log('JWT Auth Guard - Handle Request Results:');
    if (err) {
      console.error('JWT Auth Error:', err.message);
    }
    if (info) {
      console.error('JWT Auth Info:', info.message);
    }
    console.log('JWT Auth User:', user);
    
    return super.handleRequest(err, user, info, context);
  }
}