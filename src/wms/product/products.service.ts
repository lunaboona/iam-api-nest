import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement } from '../movement/entities/movement.entity';
import { ProductDefinitionsService } from '../product-definitions/product-definitions.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    public productsRepository: Repository<Product>,
    private productDefinitionsService: ProductDefinitionsService,
  ) {}

  public async getMovements(id: string): Promise<Movement[]> {
    const productWithMovements = this.productsRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .leftJoinAndSelect('product.movements', 'movement')
      .getOne();
    return (await productWithMovements).movements;
  }

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

  public async findAll(expand: boolean = false): Promise<Product[]> {
    let relations = [];
    if (expand) {
      relations = ['productDefinition', 'warehouse', 'movements'];
    }
    return await this.productsRepository.find({ relations });
  }

  public async findOne(id: string, expand: boolean = false): Promise<Product> {
    let relations = [];
    if (expand) {
      relations = ['productDefinition', 'warehouse', 'movements'];
    }
    return await this.productsRepository.findOne(id, { relations });
  }
}
