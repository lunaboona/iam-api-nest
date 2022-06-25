import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
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
  findAll(@Query('expand') expand: string) {
    return this.movementDefinitionsService.findAll(expand === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('expand') expand: string) {
    return this.movementDefinitionsService.findOne(id, expand === 'true');
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
