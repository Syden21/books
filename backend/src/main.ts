import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const dataSource = app.get(DataSource);
  try {
    await dataSource.query('SELECT NOW()');
    console.log('✅ Database connection successful');
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  });

  const host = configService.get('HTTP_HOST', 'localhost');
  const port = configService.get('HTTP_PORT', 3001);

  await app.listen(port, host);
  console.log(`🚀 Application is running on: http://${host}:${port}`);
}
bootstrap();
