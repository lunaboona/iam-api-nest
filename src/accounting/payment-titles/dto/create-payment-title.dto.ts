import { PaymentTitleStatus } from '../enum/payment-title-status.enum';

export class CreatePaymentTitleDto {
  name: string;
  originalValue: number;
  openValue: number;
  status: PaymentTitleStatus;
  dueDate: Date;
  payer: string;
  recipient: string;
}
