import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentTitleMovementsService } from './payment-title-movements.service';
import { CreatePaymentTitleMovementDto } from './dto/create-payment-title-movement.dto';
import { CreateIssuingMovementDto } from './dto/create-issuing-movement.dto';
import { CreateCancellationMovementDto } from './dto/create-cancellation-movement.dto';
import { CreatePaymentMovementDto } from './dto/create-payment-movement.dto';

@Controller('payment-title-movements')
export class PaymentTitleMovementsController {
  constructor(private readonly paymentTitleMovementsService: PaymentTitleMovementsService) {}

  @Post()
  create(@Body() createPaymentTitleMovementDto: CreatePaymentTitleMovementDto) {
    return this.paymentTitleMovementsService.create(createPaymentTitleMovementDto);
  }

  @Post('issuing')
  createIssuingMovement(@Body() dto: CreateIssuingMovementDto) {
    return this.paymentTitleMovementsService.createIssuingMovement(dto);
  }

  @Post('cancellation')
  createCancellationMovement(@Body() dto: CreateCancellationMovementDto) {
    return this.paymentTitleMovementsService.createCancellationMovement(dto);
  }

  @Post('payment')
  createPaymentMovement(@Body() dto: CreatePaymentMovementDto) {
    return this.paymentTitleMovementsService.createPaymentMovement(dto);
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
