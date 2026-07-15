import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import * as passport from 'passport';

const PgStore = pgSession(session);

async function bootstrap() {
  try {
    console.log('🚀 Starting application...');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    console.log('📋 Environment variables:');
    console.log('POSTGRES_HOST:', configService.get('POSTGRES_HOST'));
    console.log('POSTGRES_PORT:', configService.get('POSTGRES_PORT'));
    console.log('POSTGRES_USER:', configService.get('POSTGRES_USER'));
    console.log('POSTGRES_DB:', configService.get('POSTGRES_DB'));

    try {
      const dataSource = app.get(DataSource);
      await dataSource.query('SELECT NOW()');
      console.log('✅ Database connection successful');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      console.log('⚠️  Continuing without database...');
    }

    const isProduction = configService.get('NODE_ENV') === 'production';
    const sessionSecret = configService.get('SESSION_SECRET');

    if (!sessionSecret) {
      console.warn('⚠️  SESSION_SECRET not found, using default');
    }

    console.log('🔧 Setting up session...');
    app.use(
      session({
        store: new PgStore({
          conString: `postgresql://${configService.get('POSTGRES_USER')}:${configService.get('POSTGRES_PASSWORD')}@${configService.get('POSTGRES_HOST')}:${configService.get('POSTGRES_PORT')}/${configService.get('POSTGRES_DB')}`,
          tableName: 'session',
          createTableIfMissing: true,
        }),
        secret: sessionSecret || 'default_session_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: parseInt(configService.get('SESSION_MAX_AGE', '604800000')),
          secure: isProduction,
          httpOnly: true,
          sameSite: 'lax' as const,
        },
        name: 'library.sid',
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.use(cookieParser());

    app.enableCors({
      origin: [
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5173',
      ],
      credentials: true,
    });

    const host = configService.get<string>('HTTP_HOST', '0.0.0.0');
    const port = configService.get<number>('HTTP_PORT', 3000);

    console.log(`🌐 Starting server on ${host}:${port}...`);
    await app.listen(port, host);
    console.log(`🚀 Application is running on: http://${host}:${port}`);
    console.log('✅ Server started successfully!');
  } catch (error: any) {
    console.error('❌ Failed to start application:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap();
