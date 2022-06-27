import { Controller, Get, Param } from '@nestjs/common';
import { PaymentTitleMovementsService } from './payment-title-movements.service';

@Controller('payment-title-movements')
export class PaymentTitleMovementsController {
  constructor(private readonly paymentTitleMovementsService: PaymentTitleMovementsService) {}

  @Get()
  findAll() {
    return this.paymentTitleMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTitleMovementsService.findOne(id);
  }
}
