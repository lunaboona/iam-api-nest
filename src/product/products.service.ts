import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDefinitionsService } from 'src/product-definitions/product-definitions.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    public productsRepository: Repository<Product>,
    private productDefinitionsService: ProductDefinitionsService,
  ) {}

  public validateProductExpiration(product: Product): boolean {
    const expiration = new Date(product.expirationDate);
    const today = new Date();

    return expiration.getTime() <= today.getTime();
  }

  public async create(createProductDto: CreateProductDto): Promise<Product> {
    const productDefinition = await this.productDefinitionsService.findOne(
      createProductDto.productDefinitionId,
    );
    if (!productDefinition) {
      throw new BadRequestException('Product definition does not exist');
    }

    return await this.productsRepository.save(createProductDto);
  }

  public async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  public async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne(id);
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    let product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new NotFoundException();
    }

    const productDefinition = await this.productDefinitionsService.findOne(
      updateProductDto.productDefinitionId,
    );
    if (!productDefinition) {
      throw new BadRequestException('Product definition does not exist');
    }

    product = { ...product, ...updateProductDto };
    return await this.productsRepository.save(product);
  }

  public async remove(id: string): Promise<void> {
    const warehouse = await this.productsRepository.findOne(id);
    if (!warehouse) {
      throw new NotFoundException();
    }
    await this.productsRepository.delete(warehouse);
    return;
  }
}
