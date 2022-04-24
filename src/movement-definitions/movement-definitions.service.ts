import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypesService } from 'src/document-types/document-types.service';
import { MovementTypesService } from 'src/movement-types/movement-types.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateMovementDefinitionDto } from './dto/create-movement-definition.dto';
import { UpdateMovementDefinitionDto } from './dto/update-movement-definition.dto';
import { MovementDefinition } from './entities/movement-definition.entity';

@Injectable()
export class MovementDefinitionsService {
  constructor(
    @InjectRepository(MovementDefinition)
    private movementDefinitionsRepository: Repository<MovementDefinition>,
    private documentTypesService: DocumentTypesService,
    private movementTypesService: MovementTypesService,
  ) {}

  public async create(
    createMovementDefinitionDto: CreateMovementDefinitionDto,
  ): Promise<MovementDefinition> {
    const documentType = await this.documentTypesService.findOne(
      createMovementDefinitionDto.documentTypeId,
    );
    if (!documentType) {
      throw new BadRequestException('Document type does not exist');
    }

    const movementType = await this.movementTypesService.findOne(
      createMovementDefinitionDto.movementTypeId,
    );
    if (!movementType) {
      throw new BadRequestException('Movement type does not exist');
    }

    const movementDefinition = new MovementDefinition();
    movementDefinition.name = createMovementDefinitionDto.name;
    movementDefinition.documentTypeId =
      createMovementDefinitionDto.documentTypeId;
    movementDefinition.movementTypeId =
      createMovementDefinitionDto.movementTypeId;

    return await this.movementDefinitionsRepository.save(movementDefinition);
  }

  public async findAll(): Promise<MovementDefinition[]> {
    return await this.movementDefinitionsRepository.find();
  }

  public async findOne(id: string): Promise<MovementDefinition> {
    return await this.movementDefinitionsRepository.findOne(id);
  }

  public async update(
    id: string,
    updateMovementDefinitionDto: UpdateMovementDefinitionDto,
  ): Promise<UpdateResult> {
    const movementDefinition = await this.movementDefinitionsRepository.findOne(
      id,
    );
    if (!movementDefinition) {
      throw new NotFoundException();
    }

    const documentType = await this.documentTypesService.findOne(
      updateMovementDefinitionDto.documentTypeId,
    );
    if (!documentType) {
      throw new BadRequestException('Document type does not exist');
    }

    const movementType = await this.movementTypesService.findOne(
      updateMovementDefinitionDto.movementTypeId,
    );
    if (!movementType) {
      throw new BadRequestException('Movement type does not exist');
    }

    movementDefinition.name = updateMovementDefinitionDto.name;
    movementDefinition.documentTypeId =
      updateMovementDefinitionDto.documentTypeId;
    movementDefinition.movementTypeId =
      updateMovementDefinitionDto.movementTypeId;

    return await this.movementDefinitionsRepository.update(
      id,
      movementDefinition,
    );
  }

  public async remove(id: string): Promise<void> {
    const movementDefinition = await this.movementDefinitionsRepository.findOne(
      id,
    );
    if (!movementDefinition) {
      throw new NotFoundException();
    }
    await this.movementDefinitionsRepository.delete(movementDefinition);
    return;
  }
}
