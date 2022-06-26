import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReceivableTitleMovementsService } from './receivable-title-movements.service';
import { CreateReceivableTitleMovementDto } from './dto/create-receivable-title-movement.dto';
import { CreateIssuingMovementDto } from './dto/create-issuing-movement.dto';
import { CreateCancellationMovementDto } from './dto/create-cancellation-movement.dto';
import { CreatePaymentMovementDto } from './dto/create-payment-movement.dto';
import { CreateReversalMovementDto } from './dto/create-reversal-movement.dto';

@Controller('receivable-title-movements')
export class ReceivableTitleMovementsController {
  constructor(private readonly receivableTitleMovementsService: ReceivableTitleMovementsService) {}

  @Post()
  create(@Body() createReceivableTitleMovementDto: CreateReceivableTitleMovementDto) {
    return this.receivableTitleMovementsService.create(createReceivableTitleMovementDto);
  }

  @Post('issuing')
  createIssuingMovement(@Body() dto: CreateIssuingMovementDto) {
    return this.receivableTitleMovementsService.createIssuingMovement(dto);
  }

  @Post('cancellation')
  createCancellationMovement(@Body() dto: CreateCancellationMovementDto) {
    return this.receivableTitleMovementsService.createCancellationMovement(dto);
  }

  @Post('payment')
  createPaymentMovement(@Body() dto: CreatePaymentMovementDto) {
    return this.receivableTitleMovementsService.createPaymentMovement(dto);
  }

  @Post('reversal')
  createReversalMovement(@Body() dto: CreateReversalMovementDto) {
    return this.receivableTitleMovementsService.createReversalMovement(dto);
  }

  @Get()
  findAll() {
    return this.receivableTitleMovementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receivableTitleMovementsService.findOne(id);
  }
}
