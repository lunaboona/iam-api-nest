import { Controller, Get, Param } from '@nestjs/common';
import { TransactionMappingsService } from './transaction-mappings.service';

@Controller('transaction-mappings')
export class TransactionMappingsController {
  constructor(private readonly transactionMappingsService: TransactionMappingsService) {}

  @Get()
  findAll() {
    return this.transactionMappingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionMappingsService.findOne(id);
  }
}
