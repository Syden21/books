import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

const PgStore = pgSession(session);

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private sessionMiddleware: any;

  constructor(private configService: ConfigService) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const sessionSecret = this.configService.get('SESSION_SECRET');

    if (!sessionSecret) {
      throw new Error('SESSION_SECRET is not defined in environment variables');
    }

    const sessionConfig: session.SessionOptions = {
      store: new PgStore({
        conString: `postgresql://${this.configService.get('POSTGRES_USER')}:${this.configService.get('POSTGRES_PASSWORD')}@${this.configService.get('POSTGRES_HOST')}:${this.configService.get('POSTGRES_PORT')}/${this.configService.get('POSTGRES_DB')}`,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: parseInt(
          this.configService.get('SESSION_MAX_AGE', '604800000'),
        ),
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
      },
      name: 'library.sid',
    };

    this.sessionMiddleware = session(sessionConfig);
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.sessionMiddleware(req, res, next);
  }
}
