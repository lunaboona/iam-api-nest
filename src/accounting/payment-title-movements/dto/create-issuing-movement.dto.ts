export class CreateIssuingMovementDto {
  name: string;
  issuingDate: Date;
  dueDate: Date;
  value: number;
  payer: string;
  recipient: string;
}
