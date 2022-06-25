import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceivableTitle } from './entities/receivable-title.entity';
import { ReceivableTitlesController } from './receivable-titles.controller';
import { ReceivableTitlesService } from './receivable-titles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceivableTitle])],
  controllers: [ReceivableTitlesController],
  providers: [ReceivableTitlesService],
  exports: [ReceivableTitlesService],
})
export class ReceivableTitlesModule {}
