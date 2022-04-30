import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehousesRepository: Repository<Warehouse>,
  ) {}

  public async create(
    createWarehouseDto: CreateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouse = new Warehouse();
    warehouse.description = createWarehouseDto.description;

    return await this.warehousesRepository.save(warehouse);
  }

  public async findAll(): Promise<Warehouse[]> {
    return await this.warehousesRepository.find();
  }

  public async findOne(id: string): Promise<Warehouse> {
    return await this.warehousesRepository.findOne(id);
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

  public async remove(id: string): Promise<void> {
    const productDefinition = await this.warehousesRepository.findOne(id);
    if (!productDefinition) {
      throw new NotFoundException();
    }
    await this.warehousesRepository.delete(productDefinition);
    return;
  }
}
