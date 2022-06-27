import { Body, Controller, Post } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreatePurchaseCancellationDto } from './dto/create-purchase-cancellation.dto';
import { CreatePurchasePaymentDto } from './dto/create-purchase-payment.dto';
import { CreatePurchaseReversalDto } from './dto/create-purchase-reversal.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreateSaleCancellationDto } from './dto/create-sale-cancellation.dto';
import { CreateSalePaymentDto } from './dto/create-sale-payment.dto';
import { CreateSaleReversalDto } from './dto/create-sale-reversal.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('accounting')
export class AccountingController {
  constructor(
    private accountingService: AccountingService
  ) { }

  @Post('purchase')
  createPurchase(@Body() dto: CreatePurchaseDto) {
    return this.accountingService.createPurchase(dto);
  }

  @Post('purchase-payment')
  createPurchasePayment(@Body() dto: CreatePurchasePaymentDto) {
    return this.accountingService.createPurchasePayment(dto);
  }

  @Post('purchase-cancellation')
  createPurchaseCancellation(@Body() dto: CreatePurchaseCancellationDto) {
    return this.accountingService.createPurchaseCancellation(dto);
  }

  @Post('purchase-reversal')
  createPurchaseReversal(@Body() dto: CreatePurchaseReversalDto) {
    return this.accountingService.createPurchaseReversal(dto);
  }

  @Post('sale')
  createSale(@Body() dto: CreateSaleDto) {
    return this.accountingService.createSale(dto);
  }

  @Post('sale-payment')
  createSalePayment(@Body() dto: CreateSalePaymentDto) {
    return this.accountingService.createSalePayment(dto);
  }

  @Post('sale-cancellation')
  createSaleCancellation(@Body() dto: CreateSaleCancellationDto) {
    return this.accountingService.createSaleCancellation(dto);
  }

  @Post('sale-reversal')
  createSaleReversal(@Body() dto: CreateSaleReversalDto) {
    return this.accountingService.createSaleReversal(dto);
  }
}
