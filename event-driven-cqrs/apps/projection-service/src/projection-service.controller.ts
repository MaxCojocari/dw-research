import { Controller, Get } from '@nestjs/common';
import { ProjectionServiceService } from './projection-service.service';

@Controller()
export class ProjectionServiceController {
  constructor(private readonly projectionServiceService: ProjectionServiceService) {}

  @Get()
  getHello(): string {
    return this.projectionServiceService.getHello();
  }
}
