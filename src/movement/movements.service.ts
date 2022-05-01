import { BadRequestException, Injectable } from '@nestjs/common';
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

    productIds.forEach(async (productId) => {
      const product = await this.productService.findOne(productId);
      if (!product) {
        throw new BadRequestException(
          `Product with id ${productId} does not exist`,
        );
      }

      if (this.productService.validateProductExpiration(product)) {
        // TODO verificar se movement é do tipo perda
        throw new BadRequestException(
          `Product with id ${productId} is expired and cannot be processed`,
        );
      }

      products.push(product);
    });

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
