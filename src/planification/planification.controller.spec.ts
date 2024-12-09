import { Test, TestingModule } from '@nestjs/testing';
import { PlanificationController } from './planification.controller';

describe('PlanificationController', () => {
  let controller: PlanificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanificationController],
    }).compile();

    controller = module.get<PlanificationController>(PlanificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
