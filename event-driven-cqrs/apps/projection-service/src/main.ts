import { NestFactory } from '@nestjs/core';
import { ProjectionModule } from './projection.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(ProjectionModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectionModule,
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
  );

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.listen();
}
bootstrap();
