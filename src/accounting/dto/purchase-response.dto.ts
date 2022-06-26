import { PaymentTitleMovement } from '../payment-title-movements/entities/payment-title-movement.entity';
import { TransactionMapping } from '../transaction-mappings/entities/transaction-mapping.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

export class PurchaseResponseDto {
  transaction: Transaction;
  mappings: TransactionMapping[];
  paymentTitleMovement: PaymentTitleMovement;
}
