import { Module } from '@nestjs/common';
import { MovementTypesService } from './movement-types.service';
import { MovementTypesController } from './movement-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementType } from './entities/movement-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovementType])],
  controllers: [MovementTypesController],
  providers: [MovementTypesService],
  exports: [MovementTypesService],
})
export class MovementTypesModule {}
