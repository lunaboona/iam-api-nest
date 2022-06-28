import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';
export class CreateIssuingMovementDto {
  name: string;
  issuingDate: Date;
  dueDate: Date;
  value: number;
  payer: string;
  recipient: string;
  transactionMapping: TransactionMapping;
}
