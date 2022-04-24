import { Test, TestingModule } from '@nestjs/testing';
import { MovementDefinitionsController } from './movement-definitions.controller';
import { MovementDefinitionsService } from './movement-definitions.service';

describe('MovementDefinitionsController', () => {
  let controller: MovementDefinitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementDefinitionsController],
      providers: [MovementDefinitionsService],
    }).compile();

    controller = module.get<MovementDefinitionsController>(
      MovementDefinitionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
