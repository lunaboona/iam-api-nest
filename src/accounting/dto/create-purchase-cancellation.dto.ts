export class CreatePurchaseCancellationDto {
  transactionCode?: string;
  transactionName?: string;
  paymentTitleId: string;
  date: Date;
}
