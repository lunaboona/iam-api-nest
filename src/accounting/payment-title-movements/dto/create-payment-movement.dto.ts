import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';
export class CreatePaymentMovementDto {
  date: Date;
  paidValue: number;
  interestValue: number;
  fineValue: number;
  paymentTitleId: string;
  paymentMethodId: string;
  transactionMapping: TransactionMapping;
}
