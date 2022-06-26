import { Module } from '@nestjs/common';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { PaymentTitleMovementsModule } from './payment-title-movements/payment-title-movements.module';
import { TransactionMappingsModule } from './transaction-mappings/transaction-mappings.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule, TransactionMappingsModule, PaymentTitleMovementsModule],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService]
})
export class AccountingModule {}
