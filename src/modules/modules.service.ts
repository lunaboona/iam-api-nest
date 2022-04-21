import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ModuleEntity } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
  ) {}

  public async create(createModuleDto: CreateModuleDto): Promise<ModuleEntity> {
    return await this.modulesRepository.save(new ModuleEntity(createModuleDto));
  }

  public async findAll(): Promise<ModuleEntity[]> {
    return await this.modulesRepository.find();
  }

  public async findOne(id: string): Promise<ModuleEntity> {
    return await this.modulesRepository.findOne(id);
  }

  public async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<UpdateResult> {
    const module = await this.modulesRepository.findOne(id);
    if (!module) {
      throw new NotFoundException();
    }

    module.name = updateModuleDto.name;
    module.icon = updateModuleDto.icon;

    return await this.modulesRepository.update(id, module);
  }

  public async remove(id: string): Promise<void> {
    const module = await this.modulesRepository.findOne(id);
    if (!module) {
      throw new NotFoundException();
    }
    await this.modulesRepository.delete(module);
    return;
  }
}
