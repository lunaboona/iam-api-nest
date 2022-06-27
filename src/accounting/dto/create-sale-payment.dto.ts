export class CreateSalePaymentDto {
  transactionCode?: string;
  transactionName?: string;
  date?: Date;
  paidValue?: number;
  interestValue?: number;
  fineValue?: number;
  receivableTitleId?: string;
  paymentMethodId?: string;
}
