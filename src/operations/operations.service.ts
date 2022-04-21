import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulesService } from 'src/modules/modules.service';
import { Repository, UpdateResult } from 'typeorm';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { Operation } from './entities/operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
    private modulesService: ModulesService,
  ) {}

  public async create(
    createOperationDto: CreateOperationDto,
  ): Promise<Operation> {
    const module = await this.modulesService.findOne(
      createOperationDto.moduleId,
    );
    if (!module) {
      throw new BadRequestException('Module does not exist');
    }

    const existingByActivityName = await this.getByActivityName(
      createOperationDto.activityName,
    );
    if (existingByActivityName) {
      throw new BadRequestException('Activity name is taken');
    }

    const operation = new Operation();
    operation.id = createOperationDto.id;
    operation.name = createOperationDto.name;
    operation.activityName = createOperationDto.activityName;
    operation.moduleId = createOperationDto.moduleId;

    return await this.operationsRepository.save(operation);
  }

  public async findAll(): Promise<Operation[]> {
    return await this.operationsRepository.find();
  }

  public async findOne(id: string): Promise<Operation> {
    return await this.operationsRepository.findOne(id);
  }

  public async update(
    id: string,
    updateOperationDto: UpdateOperationDto,
  ): Promise<UpdateResult> {
    const operation = await this.operationsRepository.findOne(id);
    if (!operation) {
      throw new NotFoundException();
    }

    const module = await this.modulesService.findOne(
      updateOperationDto.moduleId,
    );
    if (!module) {
      throw new BadRequestException('Module does not exist');
    }

    const existingByActivityName = await this.getByActivityName(
      updateOperationDto.activityName,
    );
    if (existingByActivityName && existingByActivityName.id !== operation.id) {
      throw new BadRequestException('Activity name is taken');
    }

    operation.name = updateOperationDto.name;
    operation.activityName = updateOperationDto.activityName;
    operation.moduleId = updateOperationDto.moduleId;

    return await this.operationsRepository.update(id, operation);
  }

  public async remove(id: string): Promise<void> {
    const operation = await this.operationsRepository.findOne(id);
    if (!operation) {
      throw new NotFoundException();
    }
    await this.operationsRepository.delete(operation);
    return;
  }

  public async getByActivityName(activityName: string): Promise<Operation> {
    return await this.operationsRepository.findOne({ activityName });
  }
}
