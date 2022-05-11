import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
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

  public async getProducts(id: string): Promise<Product[]> {
    const productDefinition = await this.productDefinitionsRepository.findOne(
      id,
      {
        relations: ['products'],
      },
    );
    if (!productDefinition) {
      throw new NotFoundException();
    }
    return productDefinition.products;
  }

  public async getProductAmount(id: string): Promise<number> {
    return (await this.getProducts(id))?.filter((p) => !!p.warehouseId)?.length;
  }

  public async create(
    createProductDefinitionDto: CreateProductDefinitionDto,
  ): Promise<ProductDefinition> {
    let productDefinition = new ProductDefinition();
    productDefinition = { ...productDefinition, ...createProductDefinitionDto };

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
  ): Promise<ProductDefinition> {
    let productDefinition = await this.productDefinitionsRepository.findOne(id);
    if (!productDefinition) {
      throw new NotFoundException();
    }

    productDefinition = { ...productDefinition, ...updateProductDefinitionDto };

    return await this.productDefinitionsRepository.save(productDefinition);
  }
}
