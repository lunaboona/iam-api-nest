import { Controller, Get, Param } from '@nestjs/common';
import { PaymentTitlesService } from './payment-titles.service';

@Controller('payment-titles')
export class PaymentTitlesController {
  constructor(private readonly paymentTitlesService: PaymentTitlesService) {}

  @Get()
  findAll() {
    return this.paymentTitlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTitlesService.findOne(id);
  }
}
