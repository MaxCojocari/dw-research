import { NestApplication, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { validationPipeOptions } from '@app/common/config/configuration.schema';

async function bootstrap() {
  const adapter = new FastifyAdapter({ bodyLimit: 10048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiGatewayModule,
    adapter,
  );
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('app.port');
  const logger = new Logger(NestApplication.name);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.enableCors();

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

  await app.listen(port || 3000, '0.0.0.0');

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
