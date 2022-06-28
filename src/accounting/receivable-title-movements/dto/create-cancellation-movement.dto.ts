import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';

export class CreateCancellationMovementDto {
  receivableTitleId: string;
  date: Date;
  transactionMapping: TransactionMapping;
}
