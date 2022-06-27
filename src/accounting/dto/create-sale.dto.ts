import { CreateIssuingMovementDto } from 'src/accounting/receivable-title-movements/dto/create-issuing-movement.dto';

export class CreateSaleDto {
  transactionCode?: string;
  transactionName?: string;
  date?: Date;
  originalValue?: number;
  saleValue?: number;
  receivableTitle?: CreateIssuingMovementDto;
}
