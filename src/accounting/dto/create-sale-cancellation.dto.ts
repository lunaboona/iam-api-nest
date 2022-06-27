export class CreateSaleCancellationDto {
  transactionCode?: string;
  transactionName?: string;
  receivableTitleId: string;
  date: Date;
}
