import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import * as passport from 'passport';
import { config } from 'dotenv';

const PgStore = pgSession(session);
config();

async function bootstrap() {
  try {
    console.log('🚀 Starting application...');
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const app = await NestFactory.create(AppModule);

    try {
      const dataSource = app.get(DataSource);
      await dataSource.query('SELECT NOW()');
      console.log('✅ Database connection successful');
    } catch (error: any) {
      console.error('❌ Database connection failed:', error.message);
      console.log('⚠️  Continuing without database...');
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      console.warn('⚠️  SESSION_SECRET not found, using default');
    }

    console.log('🔧 Setting up session...');

    console.log('Тип пароля:', typeof process.env.POSTGRES_PASSWORD);
    console.log('Значение пароля:', process.env.POSTGRES_PASSWORD);

    const pgHost = process.env.POSTGRES_HOST || 'localhost';
    const pgPort = process.env.POSTGRES_PORT || '5432';
    const pgUser = process.env.POSTGRES_USER || 'postgres';
    const pgPassword = process.env.POSTGRES_PASSWORD || '';
    const pgDb = process.env.POSTGRES_DB || 'library_db';

    const connectionString = pgPassword
      ? `postgres://${pgUser}:${encodeURIComponent(pgPassword)}@${pgHost}:${pgPort}/${pgDb}`
      : `postgres://${pgUser}@${pgHost}:${pgPort}/${pgDb}`;

    const pgStore = new PgStore({
      conString: connectionString,
      tableName: 'session',
      createTableIfMissing: true,
    });

    app.use(
      session({
        store: pgStore,
        secret:
          sessionSecret || 'default_session_secret_key_must_be_long_enough',
        resave: false,
        saveUninitialized: false,
        cookie: {
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

    const host = process.env.HTTP_HOST || '0.0.0.0';
    const port = process.env.HTTP_PORT || 3000;

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
