import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReceivableTitleMovementsService } from './receivable-title-movements.service';
import { CreateReceivableTitleMovementDto } from './dto/create-receivable-title-movement.dto';

@Controller('receivable-title-movements')
export class ReceivableTitleMovementsController {
  constructor(private readonly receivableTitleMovementsService: ReceivableTitleMovementsService) {}

  @Post()
  create(@Body() createReceivableTitleMovementDto: CreateReceivableTitleMovementDto) {
    return this.receivableTitleMovementsService.create(createReceivableTitleMovementDto);
  }

  @Get()
  findAll() {
    return this.receivableTitleMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableTitleMovementsService.findOne(id);
  }
}
