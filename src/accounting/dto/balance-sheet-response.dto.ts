import { BalanceSheetTransactionDto } from './balance-sheet-transaction.dto';

export class BalanceSheetResponseDto {
  balance: number;
  transactions: BalanceSheetTransactionDto[];
}
