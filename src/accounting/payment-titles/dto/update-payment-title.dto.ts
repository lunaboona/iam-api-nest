import { PaymentTitleStatus } from '../enum/payment-title-status.enum';

export class UpdatePaymentTitleDto {
  openValue: number;
  status: PaymentTitleStatus;
}
