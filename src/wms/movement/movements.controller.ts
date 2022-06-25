import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: CreateMovementDto) {
    return this.movementsService.create(createMovementDto);
  }

  @Get()
  findAll(@Query('expand') expand: string) {
    return this.movementsService.findAll(expand === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('expand') expand: string) {
    return this.movementsService.findOne(id, expand === 'true');
  }

  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.movementsService.getProducts(id);
  }

  @Get(':id/unit-price')
  getUnitPrice(@Param('id') id: string) {
    return this.movementsService.getUnitPrice(id);
  }
}
