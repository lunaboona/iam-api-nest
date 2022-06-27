import { PaymentTitleMovement } from '../payment-title-movements/entities/payment-title-movement.entity';
import { ReceivableTitleMovement } from '../receivable-title-movements/entities/receivable-title-movement.entity';
import { TransactionMapping } from '../transaction-mappings/entities/transaction-mapping.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

export class AccountingOperationResponseDto {
  transaction: Transaction;
  mappings: TransactionMapping[];
  paymentTitleMovement?: PaymentTitleMovement;
  receivableTitleMovement?: ReceivableTitleMovement;
}
