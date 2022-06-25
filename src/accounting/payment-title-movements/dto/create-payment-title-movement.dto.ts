import { PaymentTitleMovementType } from '../enum/payment-title-movement-type.enum';

export class CreatePaymentTitleMovementDto {
  date: Date;
  type: PaymentTitleMovementType;
  paidValue: number;
  paymentMethod: string;
  interestValue: number;
  fineValue: number;
  paymentTitleId: string;
  transactionMappingId: string;
}
