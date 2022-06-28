import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';

export class CreateReversalMovementDto {
  date: Date;
  receivableTitleId: string;
  paymentMethodId: string;
  transactionMapping: TransactionMapping;
}
