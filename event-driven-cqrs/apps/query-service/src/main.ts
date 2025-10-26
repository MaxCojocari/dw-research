import { NestFactory } from '@nestjs/core';
import { QueryModule } from './query.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(QueryModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    QueryModule,
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
