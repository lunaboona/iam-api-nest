import { Controller, Get, Param } from '@nestjs/common';
import { ReceivableTitleMovementsService } from './receivable-title-movements.service';

@Controller('receivable-title-movements')
export class ReceivableTitleMovementsController {
  constructor(private readonly receivableTitleMovementsService: ReceivableTitleMovementsService) {}

  @Get()
  findAll() {
    return this.receivableTitleMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableTitleMovementsService.findOne(id);
  }
}
