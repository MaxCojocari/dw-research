import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectionServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
