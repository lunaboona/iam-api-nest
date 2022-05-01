import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { MovementDefinitionsService } from './movement-definitions.service';
import { CreateMovementDefinitionDto } from './dto/create-movement-definition.dto';

@Controller('movement-definitions')
export class MovementDefinitionsController {
  constructor(
    private readonly movementDefinitionsService: MovementDefinitionsService,
  ) {}

  @Post()
  create(@Body() createMovementDefinitionDto: CreateMovementDefinitionDto) {
    return this.movementDefinitionsService.create(createMovementDefinitionDto);
  }

  @Get()
  findAll() {
    return this.movementDefinitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementDefinitionsService.findOne(id);
  }

  @Patch(':id/set-as-active')
  setAsActive(@Param(':id') id: string) {
    return this.movementDefinitionsService.setAsActive(id);
  }

  @Patch(':id/set-as-inactive')
  setAsInactive(@Param(':id') id: string) {
    return this.movementDefinitionsService.setAsInactive(id);
  }
}
