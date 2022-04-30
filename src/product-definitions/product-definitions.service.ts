import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateProductDefinitionDto } from './dto/create-product-definition.dto';
import { UpdateProductDefinitionDto } from './dto/update-product-definition.dto';
import { ProductDefinition } from './entities/product-definition.entity';

@Injectable()
export class ProductDefinitionsService {
  constructor(
    @InjectRepository(ProductDefinition)
    private productDefinitionsRepository: Repository<ProductDefinition>,
  ) {}

  public async create(
    createProductDefinitionDto: CreateProductDefinitionDto,
  ): Promise<ProductDefinition> {
    const productDefinition = new ProductDefinition();
    productDefinition.sku = createProductDefinitionDto.sku;
    productDefinition.name = createProductDefinitionDto.name;
    productDefinition.description = createProductDefinitionDto.description;
    productDefinition.listPrice = createProductDefinitionDto.listPrice;

    return await this.productDefinitionsRepository.save(productDefinition);
  }

  public async findAll(): Promise<ProductDefinition[]> {
    return await this.productDefinitionsRepository.find();
  }

  public async findOne(id: string): Promise<ProductDefinition> {
    return await this.productDefinitionsRepository.findOne(id);
  }

  public async update(
    id: string,
    updateProductDefinitionDto: UpdateProductDefinitionDto,
  ): Promise<UpdateResult> {
    const productDefinition = await this.productDefinitionsRepository.findOne(
      id,
    );
    if (!productDefinition) {
      throw new NotFoundException();
    }

    productDefinition.sku = updateProductDefinitionDto.sku;
    productDefinition.name = updateProductDefinitionDto.name;
    productDefinition.description = updateProductDefinitionDto.description;
    productDefinition.listPrice = updateProductDefinitionDto.listPrice;

    return await this.productDefinitionsRepository.update(
      id,
      productDefinition,
    );
  }

  public async remove(id: string): Promise<void> {
    const productDefinition = await this.productDefinitionsRepository.findOne(
      id,
    );
    if (!productDefinition) {
      throw new NotFoundException();
    }
    await this.productDefinitionsRepository.delete(productDefinition);
    return;
  }
}
