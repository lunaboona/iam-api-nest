import { MovementTypeNature } from '../enum/movement-type-nature.enum';

export class CreateMovementTypeDto {
  name: string;
  nature: MovementTypeNature;
}
