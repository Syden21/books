import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  HTTP_HOST: Joi.string().default('0.0.0.0'),
  HTTP_PORT: Joi.number().default(5001),

  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().default('libraryAdmin'),
  POSTGRES_PASSWORD: Joi.string().default(process.env.POSTGRES_PASSWORD),
  POSTGRES_DB: Joi.string().default('BookReservation'),

  JWT_SECRET: Joi.string().min(32).default(process.env.JWT_SECRET),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
});
