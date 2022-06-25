import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentTitlesService } from './payment-titles.service';
import { CreatePaymentTitleDto } from './dto/create-payment-title.dto';

@Controller('payment-titles')
export class PaymentTitlesController {
  constructor(private readonly paymentTitlesService: PaymentTitlesService) {}

  @Post()
  create(@Body() createPaymentTitleDto: CreatePaymentTitleDto) {
    return this.paymentTitlesService.create(createPaymentTitleDto);
  }

  @Get()
  findAll() {
    return this.paymentTitlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTitlesService.findOne(id);
  }
}
