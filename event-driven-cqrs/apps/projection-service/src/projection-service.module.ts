import { Module } from '@nestjs/common';
import { ProjectionServiceController } from './projection-service.controller';
import { ProjectionServiceService } from './projection-service.service';

@Module({
  imports: [],
  controllers: [ProjectionServiceController],
  providers: [ProjectionServiceService],
})
export class ProjectionServiceModule {}
