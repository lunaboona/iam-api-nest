import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchasePaymentDto } from './dto/create-purchase-payment.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasePaymentResponseDto } from './dto/purchase-payment-response.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';
import { PaymentMethodsService } from './payment-methods/payment-methods.service';
import { PaymentTitleMovementsService } from './payment-title-movements/payment-title-movements.service';
import { TransactionMethod } from './transaction-mappings/enum/transaction-method.enum';
import { TransactionMappingsService } from './transaction-mappings/transaction-mappings.service';
import { TransactionsService } from './transactions/transactions.service';

@Injectable()
export class AccountingService {

  constructor(
    private transactionsService: TransactionsService,
    private transactionMappingsService: TransactionMappingsService,
    private paymentTitleMovementsService: PaymentTitleMovementsService,
    private paymentMethodsService: PaymentMethodsService
  ) { }

  public async createPurchase(dto: CreatePurchaseDto): Promise<PurchaseResponseDto> {
    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const merchandiseAccountCode = '1.1.4.01';
    const paymentTitleAccountCode = '2.1.2.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: paymentTitleAccountCode,
      date: dto.date,
      value: dto.value
    });

    const merchandiseMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: merchandiseAccountCode,
      date: dto.date,
      value: dto.value
    });

    const paymentTitleMovement = await this.paymentTitleMovementsService.createIssuingMovement({
      ...dto.paymentTitle,
      issuingDate: dto.date,
      value: dto.value,
      transactionMappingId: titleMapping.id
    });


    const titleMappingWithAccount = await this.transactionMappingsService.findOne(titleMapping.id, ['account']);
    const merchandiseMappingWithAccount = await this.transactionMappingsService.findOne(merchandiseMapping.id, ['account']);

    return {
      transaction,
      mappings: [
        titleMappingWithAccount,
        merchandiseMappingWithAccount
      ],
      paymentTitleMovement
    };
  }

  public async createPurchasePayment(dto: CreatePurchasePaymentDto): Promise<PurchasePaymentResponseDto> {
    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId)
    if (!paymentMethod) {
      throw new NotFoundException();
    }

    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const paymentTitleAccountCode = '2.1.2.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: paymentTitleAccountCode,
      date: dto.date,
      value: dto.paidValue
    });

    const paymentMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: paymentMethod.accountCode,
      date: dto.date,
      value: (dto.paidValue || 0) + (dto.interestValue || 0) + (dto.fineValue || 0)
    });

    const paymentTitleMovement = await this.paymentTitleMovementsService.createPaymentMovement({
      date: dto.date,
      fineValue: dto.fineValue,
      interestValue: dto.interestValue,
      paidValue: dto.paidValue,
      paymentMethodId: dto.paymentMethodId,
      paymentTitleId: dto.paymentTitleId,
      transactionMappingId: paymentMapping.id
    });

    const titleMappingWithAccount = await this.transactionMappingsService.findOne(titleMapping.id, ['account']);
    const paymentMappingWithAccount = await this.transactionMappingsService.findOne(paymentMapping.id, ['account']);

    return {
      transaction,
      mappings: [
        titleMappingWithAccount,
        paymentMappingWithAccount
      ],
      paymentTitleMovement
    };
  }
}
