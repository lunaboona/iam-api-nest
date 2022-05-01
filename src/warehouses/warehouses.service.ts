import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehousesRepository: Repository<Warehouse>,
  ) {}

  public async getProducts(id: string): Promise<Product[]> {
    const warehouse = await this.warehousesRepository.findOne(id, {
      relations: ['products'],
    });
    if (!warehouse) {
      throw new NotFoundException();
    }
    return warehouse.products;
  }

  public async getProductAmount(
    id: string,
    productDefinitionId: string,
  ): Promise<number> {
    return (await this.getProducts(id))?.filter(
      (p) => p.productDefinitionId === productDefinitionId,
    )?.length;
  }

  public async create(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<Warehouse> {
    let warehouse = new Warehouse();
    warehouse = { ...warehouse, ...createWarehouseDto, active: true };

    return await this.warehousesRepository.save(warehouse);
  }

  public async findAll(expand: boolean = false): Promise<Warehouse[]> {
    let relations = [];
    if (expand) {
      relations = ['products', 'movements'];
    }
    return await this.warehousesRepository.find({ relations });
  }

  public async findOne(
    id: string,
    expand: boolean = false,
  ): Promise<Warehouse> {
    let relations = [];
    if (expand) {
      relations = ['products', 'movements'];
    }
    return await this.warehousesRepository.findOne(id, { relations });
  }

  public async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOne(id);
    if (!warehouse) {
      throw new NotFoundException();
    }

    warehouse.description = updateWarehouseDto.description;

    return await this.warehousesRepository.save(warehouse);
  }

  public async setAsActive(id: string): Promise<Warehouse> {
    return this.setActiveState(id, true);
  }

  public async setAsInactive(id: string): Promise<Warehouse> {
    return this.setActiveState(id, false);
  }

  private async setActiveState(id: string, state: boolean): Promise<Warehouse> {
    const warehouse = await this.warehousesRepository.findOne(id);
    if (!warehouse) {
      throw new NotFoundException();
    }

    warehouse.active = state;

    return await this.warehousesRepository.save(warehouse);
  }
}
