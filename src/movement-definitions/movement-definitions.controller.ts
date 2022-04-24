import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MovementDefinitionsService } from './movement-definitions.service';
import { CreateMovementDefinitionDto } from './dto/create-movement-definition.dto';
import { UpdateMovementDefinitionDto } from './dto/update-movement-definition.dto';

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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementDefinitionDto: UpdateMovementDefinitionDto,
  ) {
    return this.movementDefinitionsService.update(
      id,
      updateMovementDefinitionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementDefinitionsService.remove(id);
  }
}
