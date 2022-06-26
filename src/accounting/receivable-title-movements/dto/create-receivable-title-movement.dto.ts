import { ReceivableTitleMovementType } from '../enum/receivable-title-movement-type.enum';

export class CreateReceivableTitleMovementDto {
  date: Date;
  type: ReceivableTitleMovementType;
  paidValue: number;
  receivableMethod: string;
  interestValue: number;
  fineValue: number;
  receivableTitleId: string;
  transactionMappingId: string;
}
