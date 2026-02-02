/**
 * SNSMON-AI API Server
 * Main entry point
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('SNSMON-AI API')
    .setDescription('Social Media Monitoring System for Indonesian Government')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('admin', 'Admin management endpoints')
    .addTag('api-keys', 'API key management')
    .addTag('keywords', 'Keyword configuration')
    .addTag('schedules', 'Schedule management')
    .addTag('regions', 'Region configuration')
    .addTag('accounts', 'Social account management')
    .addTag('auth', 'Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   SNSMON-AI API Server                           ║
  ║   Social Media Monitoring System                 ║
  ║                                                   ║
  ║   Server running on: http://localhost:${port}      ║
  ║   API Docs: http://localhost:${port}/docs          ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
}

bootstrap();
