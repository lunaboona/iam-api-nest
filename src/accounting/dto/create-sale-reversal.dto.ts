export class CreateSaleReversalDto {
  transactionCode?: string;
  transactionName?: string;
  date: Date;
  receivableTitleId: string;
  paymentMethodId: string;
}
