import { Module } from '@nestjs/common';
import { MovementDefinitionsService } from './movement-definitions.service';
import { MovementDefinitionsController } from './movement-definitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementDefinition } from './entities/movement-definition.entity';
import { DocumentTypesModule } from 'src/document-types/document-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovementDefinition]),
    DocumentTypesModule,
  ],
  controllers: [MovementDefinitionsController],
  providers: [MovementDefinitionsService],
  exports: [MovementDefinitionsService],
})
export class MovementDefinitionsModule {}
