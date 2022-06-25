import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionMappingsService } from './transaction-mappings.service';
import { CreateTransactionMappingDto } from './dto/create-transaction-mapping.dto';

@Controller('transaction-mappings')
export class TransactionMappingsController {
  constructor(private readonly transactionMappingsService: TransactionMappingsService) {}

  @Post()
  create(@Body() createTransactionMappingDto: CreateTransactionMappingDto) {
    return this.transactionMappingsService.create(createTransactionMappingDto);
  }

  @Get()
  findAll() {
    return this.transactionMappingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionMappingsService.findOne(id);
  }
}
