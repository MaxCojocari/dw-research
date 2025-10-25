import { NestFactory } from '@nestjs/core';
import { CommandServiceModule } from './command-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CommandServiceModule);
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
