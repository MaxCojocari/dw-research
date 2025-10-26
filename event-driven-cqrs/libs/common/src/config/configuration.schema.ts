import { ValidationPipeOptions } from '@nestjs/common';
import * as Joi from 'joi';

export const configurationSchema = Joi.object({
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_HOST_SHARD_1: Joi.string().required(),
  POSTGRES_HOST_SHARD_2: Joi.string().required(),
  POSTGRES_PORT_SHARD_1: Joi.number().default(5432),
  POSTGRES_PORT_SHARD_2: Joi.number().default(5432),
  POSTGRES_EVENT_STORE_HOST: Joi.string().required(),
  POSTGRES_EVENT_STORE_PORT: Joi.number().default(5432),
  APP_HOST: Joi.string().required(),
  APP_PORT: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  KAFKA_HOST: Joi.string().required(),
  KAFKA_PORT: Joi.number().default(9092),
});

export const validationPipeOptions: ValidationPipeOptions = {
  forbidNonWhitelisted: true,
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};
