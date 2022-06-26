import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { ReceivableTitlesModule } from '../receivable-titles/receivable-titles.module';
import { TransactionMappingsModule } from '../transaction-mappings/transaction-mappings.module';
import { ReceivableTitleMovement } from './entities/receivable-title-movement.entity';
import { ReceivableTitleMovementsController } from './receivable-title-movements.controller';
import { ReceivableTitleMovementsService } from './receivable-title-movements.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivableTitleMovement]), ReceivableTitlesModule, PaymentMethodsModule, TransactionMappingsModule],
  controllers: [ReceivableTitleMovementsController],
  providers: [ReceivableTitleMovementsService],
  exports: [ReceivableTitleMovementsService],
})
export class ReceivableTitleMovementsModule {}
