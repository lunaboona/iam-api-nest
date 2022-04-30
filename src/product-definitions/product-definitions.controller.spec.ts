import { Test, TestingModule } from '@nestjs/testing';
import { ProductDefinitionsController } from './product-definitions.controller';
import { ProductDefinitionsService } from './product-definitions.service';

describe('ProductDefinitionsController', () => {
  let controller: ProductDefinitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDefinitionsController],
      providers: [ProductDefinitionsService],
    }).compile();

    controller = module.get<ProductDefinitionsController>(
      ProductDefinitionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
