import { Controller } from '@nestjs/common';
import { ProjectionService } from './projection.service';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { Event } from '@app/common/entities/event.entity';

@Controller()
export class ProjectionController {
  constructor(private readonly projectionService: ProjectionService) {}

  @EventPattern('wallet')
  async updateBalance(@Payload() event: Event, @Ctx() context: RmqContext) {
    console.log('projection-service received event:', event);
    await this.projectionService.handleEvent(event);
  }
}
