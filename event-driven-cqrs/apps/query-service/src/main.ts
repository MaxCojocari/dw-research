import { NestFactory } from '@nestjs/core';
import { QueryServiceModule } from './query-service.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const app = await NestFactory.create(QueryServiceModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.REDIS,
      options: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
}
bootstrap();
