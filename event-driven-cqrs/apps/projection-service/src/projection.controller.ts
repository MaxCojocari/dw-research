import { Controller } from '@nestjs/common';
import { ProjectionService } from './projection.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Event } from '@app/common/entities/event.entity';

@Controller()
export class ProjectionController {
  constructor(private readonly projectionService: ProjectionService) {}

  @EventPattern('wallet')
  updateBalance(@Payload() event: Event) {
    this.projectionService.handleEvent(event);
  }
}
