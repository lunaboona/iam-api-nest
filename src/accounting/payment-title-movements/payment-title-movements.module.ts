import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { PaymentTitlesModule } from '../payment-titles/payment-titles.module';
import { TransactionMappingsModule } from '../transaction-mappings/transaction-mappings.module';
import { PaymentTitleMovement } from './entities/payment-title-movement.entity';
import { PaymentTitleMovementsController } from './payment-title-movements.controller';
import { PaymentTitleMovementsService } from './payment-title-movements.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTitleMovement]), PaymentTitlesModule, PaymentMethodsModule, TransactionMappingsModule],
  controllers: [PaymentTitleMovementsController],
  providers: [PaymentTitleMovementsService],
  exports: [PaymentTitleMovementsService],
})
export class PaymentTitleMovementsModule {}
