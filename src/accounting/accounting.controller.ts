import { Body, Controller, Post } from '@nestjs/common';
import { AccountingService } from './accounting.service';
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
}
