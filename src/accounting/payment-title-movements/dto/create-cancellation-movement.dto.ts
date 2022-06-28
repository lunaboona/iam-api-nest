import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';

export class CreateCancellationMovementDto {
  paymentTitleId: string;
  date: Date;
  transactionMapping: TransactionMapping;
}
