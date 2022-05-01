import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ProductDefinitionsModule } from 'src/product-definitions/product-definitions.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductDefinitionsModule,
    WarehousesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
