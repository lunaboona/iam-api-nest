import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MovementTypesService } from './movement-types.service';
import { CreateMovementTypeDto } from './dto/create-movement-type.dto';
import { UpdateMovementTypeDto } from './dto/update-movement-type.dto';

@Controller('movement-types')
export class MovementTypesController {
  constructor(private readonly movementTypesService: MovementTypesService) {}

  @Post()
  create(@Body() createMovementTypeDto: CreateMovementTypeDto) {
    return this.movementTypesService.create(createMovementTypeDto);
  }

  @Get()
  findAll() {
    return this.movementTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementTypesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovementTypeDto: UpdateMovementTypeDto,
  ) {
    return this.movementTypesService.update(id, updateMovementTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementTypesService.remove(id);
  }
}
