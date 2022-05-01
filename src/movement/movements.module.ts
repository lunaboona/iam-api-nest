import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';
import { MovementDefinitionsModule } from 'src/movement-definitions/movement-definitions.module';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { ProductsModule } from 'src/product/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    MovementDefinitionsModule,
    WarehousesModule,
    ProductsModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
