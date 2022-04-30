import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductDefinitionsService } from './product-definitions.service';
import { CreateProductDefinitionDto } from './dto/create-product-definition.dto';
import { UpdateProductDefinitionDto } from './dto/update-product-definition.dto';

@Controller('product-definitions')
export class ProductDefinitionsController {
  constructor(
    private readonly productDefinitionsService: ProductDefinitionsService,
  ) {}

  @Post()
  create(@Body() createProductDefinitionDto: CreateProductDefinitionDto) {
    return this.productDefinitionsService.create(createProductDefinitionDto);
  }

  @Get()
  findAll() {
    return this.productDefinitionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDefinitionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDefinitionDto: UpdateProductDefinitionDto,
  ) {
    return this.productDefinitionsService.update(
      id,
      updateProductDefinitionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDefinitionsService.remove(id);
  }
}
