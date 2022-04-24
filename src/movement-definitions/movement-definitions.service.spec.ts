import { Test, TestingModule } from '@nestjs/testing';
import { MovementDefinitionsService } from './movement-definitions.service';

describe('MovementDefinitionsService', () => {
  let service: MovementDefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementDefinitionsService],
    }).compile();

    service = module.get<MovementDefinitionsService>(
      MovementDefinitionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
