import { NestFactory } from '@nestjs/core';
import { CommandModule } from './command.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { validationPipeOptions } from '@app/common/config/configuration.schema';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(CommandModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommandModule,
    {
      transport: Transport.REDIS,
      options: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.listen();
}
bootstrap();
