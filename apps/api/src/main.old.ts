import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Compression
  app.use(compression());

  // Global validation pipe
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

  // CORS configuration
  app.enableCors({
    origin: [
      configService.get('WEB_URL', 'http://localhost:3000'),
      configService.get('PORTAL_URL', 'http://localhost:3000'),
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CRM Nexus API')
      .setDescription('Production-ready CRM API for bathroom industry')
      .setVersion('1.0')
      .setContact(
        'Bowmans Kitchens & Bathrooms',
        'https://bowmanskb.co.uk',
        'info@bowmanskb.co.uk'
      )
      .addBearerAuth()
      .addTag('auth', 'Authentication & Authorization')
      .addTag('users', 'User Management')
      .addTag('clients', 'Client Management')
      .addTag('leads', 'Lead Management')
      .addTag('deals', 'Deal Management')
      .addTag('jobs', 'Job Management')
      .addTag('activities', 'Activity Tracking')
      .addTag('tasks', 'Task Management')
      .addTag('appointments', 'Appointment Scheduling')
      .addTag('portal', 'Client Portal')
      .addTag('mobile', 'Mobile App APIs')
      .addTag('files', 'File Management')
      .addTag('reports', 'Reporting & Analytics')
      .addTag('integrations', 'Third-party Integrations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    logger.log('📚 Swagger documentation available at /api/docs');
  }

  const port = configService.get('PORT', 3001);
  
  await app.listen(port);
  
  logger.log(`🚀 CRM Nexus API is running on port ${port}`);
  logger.log(`🌐 Environment: ${configService.get('NODE_ENV', 'development')}`);
  
  if (configService.get('NODE_ENV') !== 'production') {
    logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
