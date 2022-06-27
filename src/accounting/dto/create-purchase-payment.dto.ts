export class CreatePurchasePaymentDto {
  transactionCode?: string;
  transactionName?: string;
  date?: Date;
  paidValue?: number;
  interestValue?: number;
  fineValue?: number;
  paymentTitleId?: string;
  paymentMethodId?: string;
}
