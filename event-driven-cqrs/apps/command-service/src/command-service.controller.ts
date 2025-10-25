import { Controller, Get } from '@nestjs/common';
import { CommandServiceService } from './command-service.service';

@Controller()
export class CommandServiceController {
  constructor(private readonly commandServiceService: CommandServiceService) {}

  @Get()
  getHello(): string {
    return this.commandServiceService.getHello();
  }
}
