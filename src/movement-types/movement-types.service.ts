import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateMovementTypeDto } from './dto/create-movement-type.dto';
import { UpdateMovementTypeDto } from './dto/update-movement-type.dto';
import { MovementType } from './entities/movement-type.entity';

@Injectable()
export class MovementTypesService {
  constructor(
    @InjectRepository(MovementType)
    private movementTypesRepository: Repository<MovementType>,
  ) {}

  public async create(
    createMovementTypeDto: CreateMovementTypeDto,
  ): Promise<MovementType> {
    const movementType = new MovementType();
    movementType.name = createMovementTypeDto.name;
    movementType.nature = createMovementTypeDto.nature;

    return await this.movementTypesRepository.save(movementType);
  }

  public async findAll(): Promise<MovementType[]> {
    return await this.movementTypesRepository.find();
  }

  public async findOne(id: string): Promise<MovementType> {
    return await this.movementTypesRepository.findOne(id);
  }

  public async update(
    id: string,
    updateMovementTypeDto: UpdateMovementTypeDto,
  ): Promise<UpdateResult> {
    const movementType = await this.movementTypesRepository.findOne(id);
    if (!movementType) {
      throw new NotFoundException();
    }

    movementType.name = updateMovementTypeDto.name;
    movementType.nature = updateMovementTypeDto.nature;

    return await this.movementTypesRepository.update(id, movementType);
  }

  public async remove(id: string): Promise<void> {
    const movementType = await this.movementTypesRepository.findOne(id);
    if (!movementType) {
      throw new NotFoundException();
    }
    await this.movementTypesRepository.delete(movementType);
    return;
  }
}
