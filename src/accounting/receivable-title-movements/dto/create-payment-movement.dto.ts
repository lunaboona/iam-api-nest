export class CreatePaymentMovementDto {
  date: Date;
  paidValue: number;
  interestValue: number;
  fineValue: number;
  receivableTitleId: string;
  paymentMethodId: string;
  transactionMappingId: string;
}
