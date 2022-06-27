import { Body, Controller, Post } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreatePurchasePaymentDto } from './dto/create-purchase-payment.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

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
}
