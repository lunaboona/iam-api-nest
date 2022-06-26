export class CreatePaymentMovementDto {
  date: Date;
  paidValue: number;
  interestValue: number;
  fineValue: number;
  paymentTitleId: string;
  paymentMethodId: string;
  transactionMappingId: string;
}
