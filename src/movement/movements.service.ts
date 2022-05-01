import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementNature } from 'src/movement-definitions/enum/movement-nature.enum';
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
    private warehousesService: WarehousesService,
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

    if (!movementDefinition.active) {
      throw new BadRequestException('Movement definition is not active');
    }

    if (movementDefinition.nature === MovementNature.Incoming) {
      if (!createMovementDto.warehouseId) {
        throw new BadRequestException(
          'Warehouse ID must be provided for movements of Incoming nature',
        );
      }
      const warehouse = await this.warehousesService.findOne(
        createMovementDto.warehouseId,
      );
      if (!warehouse) {
        throw new BadRequestException('Warehouse does not exist');
      }

      if (!warehouse.active) {
        throw new BadRequestException('Warehouse is not active');
      }
    } else {
      createMovementDto.warehouseId = null;
    }

    const products: Product[] = [];
    // Remove duplicates
    const productIds = [...new Set(createMovementDto.productIds)];

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

      if (
        movementDefinition.nature === MovementNature.Incoming &&
        product.warehouseId
      ) {
        throw new BadRequestException(
          `Product with id ${productId} can't be processed because movement nature is Incoming and product is already in a warehouse`,
        );
      }

      if (
        movementDefinition.nature === MovementNature.Outgoing &&
        !product.warehouseId
      ) {
        throw new BadRequestException(
          `Product with id ${productId} can't be processed because movement nature is Outgoing and product is not in a warehouse`,
        );
      }

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

    for (const product of products) {
      product.warehouseId = createMovementDto.warehouseId;
      this.productService.productsRepository.save(product);
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
