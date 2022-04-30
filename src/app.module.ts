import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { ModulesModule } from './modules/modules.module';
import { MovementTypesModule } from './movement-types/movement-types.module';
import { DocumentTypesModule } from './document-types/document-types.module';
import { MovementDefinitionsModule } from './movement-definitions/movement-definitions.module';
import { ProductDefinitionsModule } from './product-definitions/product-definitions.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ProductsModule } from './product/warehouses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    OperationsModule,
    ModulesModule,
    MovementTypesModule,
    DocumentTypesModule,
    MovementDefinitionsModule,
    ProductDefinitionsModule,
    WarehousesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
