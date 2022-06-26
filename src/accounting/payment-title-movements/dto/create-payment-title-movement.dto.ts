import { PaymentTitleMovementType } from '../enum/payment-title-movement-type.enum';

export class CreatePaymentTitleMovementDto {
  date: Date;
  type: PaymentTitleMovementType;
  paidValue: number;
  interestValue: number;
  fineValue: number;
  paymentTitleId: string;
  transactionMappingId: string;
  paymentMethodId: string;
}
