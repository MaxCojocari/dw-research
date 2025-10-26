import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './config/configuration.schema';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const adapter = new FastifyAdapter({ bodyLimit: 10048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<number>('app.port');
  const logger = new Logger(NestApplication.name);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.enableCors();

  await app.listen(port!, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
