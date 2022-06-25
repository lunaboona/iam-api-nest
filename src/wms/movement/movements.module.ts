import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';
import { MovementDefinitionsModule } from '../movement-definitions/movement-definitions.module';
import { WarehousesModule } from '../warehouses/warehouses.module';
import { ProductsModule } from '../product/products.module';
import { DocumentTypesModule } from '../document-types/document-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    MovementDefinitionsModule,
    WarehousesModule,
    ProductsModule,
    DocumentTypesModule,
  ],
  controllers: [MovementsController],
  providers: [MovementsService],
  exports: [MovementsService],
})
export class MovementsModule {}
