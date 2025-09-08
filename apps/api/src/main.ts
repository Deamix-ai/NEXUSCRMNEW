import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3001);
  const nodeEnv = configService.get('NODE_ENV', 'development');

  // Enable CORS
  app.enableCors({
    origin: nodeEnv === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true,
  });

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

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CRM Nexus API')
      .setDescription('Production-ready CRM API for bathroom industry')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('clients', 'Client management')
      .addTag('leads', 'Lead management')
      .addTag('deals', 'Deal management')
      .addTag('jobs', 'Job management')
      .addTag('portal', 'Client portal')
      .addTag('mobile', 'Mobile field operations')
      .addTag('reports', 'Reporting and analytics')
      .addTag('integrations', 'Third-party integrations')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);
  
  const logger = new Logger('Bootstrap');
  logger.log(`🚀 API server is running on: http://localhost:${port}`);
  logger.log(`📚 API documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔧 Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', error);
  process.exit(1);
});
