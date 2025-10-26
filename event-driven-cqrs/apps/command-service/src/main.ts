import { NestFactory } from '@nestjs/core';
import { CommandServiceModule } from './command-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { validationPipeOptions } from '@app/common/config/configuration.schema';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CommandServiceModule);
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
