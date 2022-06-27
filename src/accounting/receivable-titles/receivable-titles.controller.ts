import { Controller, Get, Param } from '@nestjs/common';
import { ReceivableTitlesService } from './receivable-titles.service';

@Controller('receivable-titles')
export class ReceivableTitlesController {
  constructor(private readonly receivableTitlesService: ReceivableTitlesService) { }

  @Get()
  findAll() {
    return this.receivableTitlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableTitlesService.findOne(id);
  }
}
