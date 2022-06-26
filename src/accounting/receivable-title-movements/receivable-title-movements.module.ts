import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivableTitleMovement } from './entities/receivable-title-movement.entity';
import { ReceivableTitleMovementsController } from './receivable-title-movements.controller';
import { ReceivableTitleMovementsService } from './receivable-title-movements.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivableTitleMovement])],
  controllers: [ReceivableTitleMovementsController],
  providers: [ReceivableTitleMovementsService],
  exports: [ReceivableTitleMovementsService],
})
export class ReceivableTitleMovementsModule {}
