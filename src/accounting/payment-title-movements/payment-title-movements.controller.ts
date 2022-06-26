import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentTitleMovementsService } from './payment-title-movements.service';
import { CreatePaymentTitleMovementDto } from './dto/create-payment-title-movement.dto';
import { CreateIssuingPaymentTitleMovementDto } from './dto/create-issuing-payment-title-movement.dto';

@Controller('payment-title-movements')
export class PaymentTitleMovementsController {
  constructor(private readonly paymentTitleMovementsService: PaymentTitleMovementsService) {}

  @Post()
  create(@Body() createPaymentTitleMovementDto: CreatePaymentTitleMovementDto) {
    return this.paymentTitleMovementsService.create(createPaymentTitleMovementDto);
  }

  @Post('issuing')
  createIssuingPaymentMovementTitle(@Body() dto: CreateIssuingPaymentTitleMovementDto) {
    return this.paymentTitleMovementsService.createIssuingPaymentTitleMovement(dto);
  }

  @Get()
  findAll() {
    return this.paymentTitleMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentTitleMovementsService.findOne(id);
  }
}
