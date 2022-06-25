import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './iam/users/users.module';
import { OperationsModule } from './iam/operations/operations.module';
import { ModulesModule } from './iam/modules/modules.module';
import { DocumentTypesModule } from './wms/document-types/document-types.module';
import { MovementDefinitionsModule } from './wms/movement-definitions/movement-definitions.module';
import { ProductDefinitionsModule } from './wms/product-definitions/product-definitions.module';
import { WarehousesModule } from './wms/warehouses/warehouses.module';
import { ProductsModule } from './wms/product/products.module';
import { MovementsModule } from './wms/movement/movements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    OperationsModule,
    ModulesModule,
    DocumentTypesModule,
    MovementDefinitionsModule,
    ProductDefinitionsModule,
    WarehousesModule,
    ProductsModule,
    MovementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
