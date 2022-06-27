import { Module } from '@nestjs/common';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { PaymentTitleMovementsModule } from './payment-title-movements/payment-title-movements.module';
import { PaymentTitlesModule } from './payment-titles/payment-titles.module';
import { TransactionMappingsModule } from './transaction-mappings/transaction-mappings.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TransactionsModule,
    TransactionMappingsModule,
    PaymentTitleMovementsModule,
    PaymentMethodsModule,
    PaymentTitlesModule,
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
