import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementDefinitionsService } from 'src/movement-definitions/movement-definitions.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductsService } from 'src/product/products.service';
import { WarehousesService } from 'src/warehouses/warehouses.service';
import { Repository } from 'typeorm';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Movement } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private movementsRepository: Repository<Movement>,
    private movementDefinitionsService: MovementDefinitionsService,
    private warehouseService: WarehousesService,
    private productService: ProductsService,
  ) {}

  public async getProducts(id: string): Promise<Product[]> {
    const movement = await this.movementsRepository.findOne(id, {
      relations: ['products'],
    });

    if (!movement) {
      throw new NotFoundException();
    }
    return movement.products;
  }

  public async getUnitPrice(id: string): Promise<number> {
    const movement = await this.movementsRepository.findOne(id, {
      relations: ['products'],
    });
    if (!movement) {
      throw new NotFoundException();
    }
    return movement.totalPrice / movement.products.length;
  }

  public async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    const movementDefinition = await this.movementDefinitionsService.findOne(
      createMovementDto.movementDefinitionId,
    );
    if (!movementDefinition) {
      throw new BadRequestException('Movement definition does not exist');
    }

    const warehouse = await this.warehouseService.findOne(
      createMovementDto.warehouseId,
    );
    if (!warehouse) {
      throw new BadRequestException('Warehouse does not exist');
    }

    const products: Product[] = [];
    const productIds = createMovementDto.productIds;

    if (productIds.length === 0) {
      throw new BadRequestException(`Movement must have at least one product`);
    }

    for (const productId of productIds) {
      const product = await this.productService.findOne(productId);
      if (!product) {
        throw new BadRequestException(
          `Product with id ${productId} does not exist`,
        );
      }

      // TODO product cant have warehouseId if incoming
      // TODO add product warehouseId if incoming
      // TODO remove product warehouseId if outgoing
      // TODO filter productIds to remove duplicates

      if (
        this.productService.validateProductExpiration(product) &&
        !movementDefinition.isLoss
      ) {
        throw new BadRequestException(
          `Product with id ${productId} is expired and cannot be processed unless movement is defined as a loss`,
        );
      }

      products.push(product);
    }

    const movement = new Movement();
    movement.fillFields(createMovementDto, products);

    return await this.movementsRepository.save(movement);
  }

  public async findAll(): Promise<Movement[]> {
    return await this.movementsRepository.find();
  }

  public async findOne(id: string): Promise<Movement> {
    return await this.movementsRepository.findOne(id);
  }
}
