import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectionService {
  getHello(): string {
    return 'Hello World!';
  }
}
