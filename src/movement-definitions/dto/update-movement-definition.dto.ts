import { PartialType } from '@nestjs/mapped-types';
import { CreateMovementDefinitionDto } from './create-movement-definition.dto';

export class UpdateMovementDefinitionDto extends PartialType(
  CreateMovementDefinitionDto,
) {}
