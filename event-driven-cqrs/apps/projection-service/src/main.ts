import { NestFactory } from '@nestjs/core';
import { ProjectionServiceModule } from './projection-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProjectionServiceModule);
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
