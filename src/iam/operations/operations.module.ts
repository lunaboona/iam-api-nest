import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { Operation } from './entities/operation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Operation]), ModulesModule],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService],
})
export class OperationsModule {}
