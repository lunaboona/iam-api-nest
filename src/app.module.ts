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
import { AccountsModule } from './accounting/accounts/accounts.module';
import { TransactionMappingsModule } from './accounting/transaction-mappings/transaction-mappings.module';
import { TransactionsModule } from './accounting/transactions/transactions.module';
import { PaymentTitlesModule } from './accounting/payment-mappings/payment-titles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    // IAM
    UsersModule,
    OperationsModule,
    ModulesModule,
    // WMS
    DocumentTypesModule,
    MovementDefinitionsModule,
    ProductDefinitionsModule,
    WarehousesModule,
    ProductsModule,
    MovementsModule,
    // Accounting
    AccountsModule,
    PaymentTitlesModule,
    TransactionMappingsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
