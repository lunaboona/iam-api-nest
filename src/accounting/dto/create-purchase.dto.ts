import { CreateIssuingMovementDto } from 'src/accounting/payment-title-movements/dto/create-issuing-movement.dto';

export class CreatePurchaseDto {
  transactionCode?: string;
  transactionName?: string;
  paymentTitle?: CreateIssuingMovementDto;
}
