import { MovementNature } from '../enum/movement-nature.enum';

export class CreateMovementDefinitionDto {
  name: string;
  documentTypeId: string;
  nature: MovementNature;
  isLoss: boolean;
}
