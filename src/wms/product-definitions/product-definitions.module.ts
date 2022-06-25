import { Module } from '@nestjs/common';
import { ProductDefinitionsService } from './product-definitions.service';
import { ProductDefinitionsController } from './product-definitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDefinition } from './entities/product-definition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDefinition])],
  controllers: [ProductDefinitionsController],
  providers: [ProductDefinitionsService],
  exports: [ProductDefinitionsService],
})
export class ProductDefinitionsModule {}
