import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDefinitionDto } from './create-product-definition.dto';

export class UpdateProductDefinitionDto extends PartialType(
  CreateProductDefinitionDto,
) {}
