export class CreateMovementDto {
  totalPrice: number;
  dateTime: Date;
  document: string;
  movementDefinitionId: string;
  warehouseId: string;
  transactionCode?: string;
  productIds: string[];
}
