import { NestFactory } from '@nestjs/core';
import { QueryServiceModule } from './query-service.module';

async function bootstrap() {
  const app = await NestFactory.create(QueryServiceModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
