import { TransactionMethod } from '../transaction-mappings/enum/transaction-method.enum';

export class BalanceSheetTransactionDto {
  id: string;
  date: Date;
  value: number;
  transactionCode: string;
  transactionName: string;
  accountCode: string;
  accountName: string;
  method: TransactionMethod;
  methodDescription: string;
}
