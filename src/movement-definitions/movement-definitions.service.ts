import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypesService } from 'src/document-types/document-types.service';
import { Repository } from 'typeorm';
import { CreateMovementDefinitionDto } from './dto/create-movement-definition.dto';
import { MovementDefinition } from './entities/movement-definition.entity';
import { MovementNature } from './enum/movement-nature.enum';

@Injectable()
export class MovementDefinitionsService {
  constructor(
    @InjectRepository(MovementDefinition)
    private movementDefinitionsRepository: Repository<MovementDefinition>,
    private documentTypesService: DocumentTypesService,
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

    if (
      createMovementDefinitionDto.isLoss &&
      createMovementDefinitionDto.nature !== MovementNature.Outgoing
    ) {
      throw new BadRequestException(
        'Movement definition can only be defined as a loss if movement nature is outgoing',
      );
    }

    let movementDefinition = new MovementDefinition();
    movementDefinition = {
      ...movementDefinition,
      ...createMovementDefinitionDto,
      active: true,
    };

    return await this.movementDefinitionsRepository.save(movementDefinition);
  }

  public async findAll(): Promise<MovementDefinition[]> {
    return await this.movementDefinitionsRepository.find();
  }

  public async findOne(id: string): Promise<MovementDefinition> {
    return await this.movementDefinitionsRepository.findOne(id);
  }

  public async setAsActive(id: string): Promise<MovementDefinition> {
    return this.setActiveState(id, true);
  }

  public async setAsInactive(id: string): Promise<MovementDefinition> {
    return this.setActiveState(id, false);
  }

  private async setActiveState(
    id: string,
    state: boolean,
  ): Promise<MovementDefinition> {
    const movementType = await this.movementDefinitionsRepository.findOne(id);
    if (!movementType) {
      throw new NotFoundException();
    }

    movementType.active = state;

    return await this.movementDefinitionsRepository.save(movementType);
  }
}
