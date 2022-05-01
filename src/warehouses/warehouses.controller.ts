import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Get(':id/products')
  getProducts(@Param('id') id: string) {
    return this.warehousesService.getProducts(id);
  }

  @Get(':id/product-amount/:productDefinitionId')
  getProductAmount(
    @Param('id') id: string,
    @Param('productDefinitionId') productDefinitionId: string,
  ) {
    return this.warehousesService.getProductAmount(id, productDefinitionId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Patch(':id/set-as-active')
  setAsActive(@Param(':id') id: string) {
    return this.warehousesService.setAsActive(id);
  }

  @Patch(':id/set-as-inactive')
  setAsInactive(@Param(':id') id: string) {
    return this.warehousesService.setAsInactive(id);
  }
}
