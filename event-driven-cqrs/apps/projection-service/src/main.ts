import { NestFactory } from '@nestjs/core';
import { ProjectionModule } from './projection.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const app = await NestFactory.create(ProjectionModule);
  const configService = app.get<ConfigService>(ConfigService);
  console.log(process.env.RMQ_URL, process.env.QUEUE_NAME);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('rabbit.url')],
      queue: configService.get('queue'),
      // queue: configService.get('projection-wallet-events'),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.init();
}
bootstrap();
