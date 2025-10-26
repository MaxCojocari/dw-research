import { NestFactory } from '@nestjs/core';
import { ProjectionServiceModule } from './projection-service.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const app = await NestFactory.create(ProjectionServiceModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [
            `${configService.get('kafka.host')}:${configService.get('kafka.port')}`,
          ],
        },
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
}
bootstrap();
