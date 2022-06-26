import { ReceivableTitleStatus } from '../enum/receivable-title-status.enum';

export class UpdateReceivableTitleDto {
  openValue: number;
  status: ReceivableTitleStatus;
}
