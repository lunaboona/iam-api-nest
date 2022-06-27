export class CreatePurchaseReversalDto {
  transactionCode?: string;
  transactionName?: string;
  date: Date;
  paymentTitleId: string;
  paymentMethodId: string;
}
