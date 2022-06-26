import { TransactionMethod } from '../enum/transaction-method.enum';

export class CreateTransactionMappingDto {
  transactionCode: string;
  accountCode: string;
  method: TransactionMethod;
  date: Date;
  value: number;
}
