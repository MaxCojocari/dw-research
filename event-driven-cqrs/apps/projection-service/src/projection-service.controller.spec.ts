import { Test, TestingModule } from '@nestjs/testing';
import { ProjectionServiceController } from './projection-service.controller';
import { ProjectionServiceService } from './projection-service.service';

describe('ProjectionServiceController', () => {
  let projectionServiceController: ProjectionServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectionServiceController],
      providers: [ProjectionServiceService],
    }).compile();

    projectionServiceController = app.get<ProjectionServiceController>(ProjectionServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectionServiceController.getHello()).toBe('Hello World!');
    });
  });
});
