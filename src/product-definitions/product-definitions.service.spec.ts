import { Test, TestingModule } from '@nestjs/testing';
import { ProductDefinitionsService } from './product-definitions.service';

describe('ProductDefinitionsService', () => {
  let service: ProductDefinitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDefinitionsService],
    }).compile();

    service = module.get<ProductDefinitionsService>(ProductDefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
