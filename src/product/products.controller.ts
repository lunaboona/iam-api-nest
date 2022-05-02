import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query('expand') expand: string) {
    return this.productsService.findAll(expand === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('expand') expand: string) {
    return this.productsService.findOne(id, expand === 'true');
  }

  @Get(':id/movements')
  getMovements(@Param('id') id: string) {
    return this.productsService.getMovements(id);
  }
}
