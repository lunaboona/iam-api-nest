import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Controller('document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  findAll() {
    return this.documentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentTypesService.findOne(id);
  }

  @Patch(':id/set-as-active')
  setAsActive(@Param(':id') id: string) {
    return this.documentTypesService.setAsActive(id);
  }

  @Patch(':id/set-as-inactive')
  setAsInactive(@Param(':id') id: string) {
    return this.documentTypesService.setAsInactive(id);
  }
}
