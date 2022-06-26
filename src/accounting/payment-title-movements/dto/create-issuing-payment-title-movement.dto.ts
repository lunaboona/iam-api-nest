export class CreateIssuingPaymentTitleMovementDto {
  name: string;
  issuingDate: Date;
  dueDate: Date;
  value: number;
  payer: string;
  recipient: string;
}
