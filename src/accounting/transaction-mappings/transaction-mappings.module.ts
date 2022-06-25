import { Module } from '@nestjs/common';
import { TransactionMappingsService } from './transaction-mappings.service';
import { TransactionMappingsController } from './transaction-mappings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionMapping } from './entities/transaction-mapping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionMapping])],
  controllers: [TransactionMappingsController],
  providers: [TransactionMappingsService],
  exports: [TransactionMappingsService],
})
export class TransactionMappingsModule {}
