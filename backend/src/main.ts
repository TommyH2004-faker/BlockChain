import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Temporarily remove the API prefix for debugging
  // app.setGlobalPrefix('api/v1');
  
  // Enable CORS for frontend - allow all origins for development
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
  
  await app.listen(8080);
  console.log('Server started on http://localhost:8080/api/v1');
}
bootstrap();
