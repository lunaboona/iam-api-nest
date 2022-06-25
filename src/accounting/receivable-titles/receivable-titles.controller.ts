import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReceivableTitlesService } from './receivable-titles.service';
import { CreateReceivableTitleDto } from './dto/create-receivable-title.dto';

@Controller('receivable-titles')
export class ReceivableTitlesController {
  constructor(private readonly receivableTitlesService: ReceivableTitlesService) {}

  @Post()
  create(@Body() createReceivableTitleDto: CreateReceivableTitleDto) {
    return this.receivableTitlesService.create(createReceivableTitleDto);
  }

  @Get()
  findAll() {
    return this.receivableTitlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableTitlesService.findOne(id);
  }
}
