import { ReceivableTitleStatus } from '../enum/receivable-title-status.enum';

export class CreateReceivableTitleDto {
  name: string;
  originalValue: number;
  openValue: number;
  status: ReceivableTitleStatus;
  dueDate: Date;
  payer: string;
  recipient: string;
}
