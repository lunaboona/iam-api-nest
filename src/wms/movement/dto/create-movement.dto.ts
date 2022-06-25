export class CreateMovementDto {
  totalPrice: number;
  dateTime: Date;
  document: string;
  movementDefinitionId: string;
  warehouseId: string;
  productIds: string[];
}
