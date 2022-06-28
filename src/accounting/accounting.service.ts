import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountingOperationResponseDto } from './dto/accounting-operation-response.dto';
import { CreatePurchaseCancellationDto } from './dto/create-purchase-cancellation.dto';
import { CreatePurchasePaymentDto } from './dto/create-purchase-payment.dto';
import { CreatePurchaseReversalDto } from './dto/create-purchase-reversal.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreateSaleCancellationDto } from './dto/create-sale-cancellation.dto';
import { CreateSalePaymentDto } from './dto/create-sale-payment.dto';
import { CreateSaleReversalDto } from './dto/create-sale-reversal.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { PaymentMethodsService } from './payment-methods/payment-methods.service';
import { PaymentTitleMovementsService } from './payment-title-movements/payment-title-movements.service';
import { PaymentTitlesService } from './payment-titles/payment-titles.service';
import { ReceivableTitleMovementType } from './receivable-title-movements/enum/receivable-title-movement-type.enum';
import { ReceivableTitleMovementsService } from './receivable-title-movements/receivable-title-movements.service';
import { ReceivableTitlesService } from './receivable-titles/receivable-titles.service';
import { TransactionMethod } from './transaction-mappings/enum/transaction-method.enum';
import { TransactionMappingsService } from './transaction-mappings/transaction-mappings.service';
import { TransactionsService } from './transactions/transactions.service';

@Injectable()
export class AccountingService {

  constructor(
    private transactionsService: TransactionsService,
    private transactionMappingsService: TransactionMappingsService,
    private paymentTitleMovementsService: PaymentTitleMovementsService,
    private paymentMethodsService: PaymentMethodsService,
    private paymentTitlesService: PaymentTitlesService,
    private receivableTitleMovementsService: ReceivableTitleMovementsService,
    private receivableTitlesService: ReceivableTitlesService,
  ) { }

  //#region Purchase
  public async createPurchase(dto: CreatePurchaseDto): Promise<AccountingOperationResponseDto> {
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

  public async createPurchasePayment(dto: CreatePurchasePaymentDto): Promise<AccountingOperationResponseDto> {
    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId)
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId)
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
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

  public async createPurchaseCancellation(dto: CreatePurchaseCancellationDto): Promise<AccountingOperationResponseDto> {
    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId)
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const merchandiseAccountCode = '1.1.4.01';
    const paymentTitleAccountCode = '2.1.2.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: paymentTitleAccountCode,
      date: dto.date,
      value: paymentTitle.originalValue
    });

    const merchandiseMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: merchandiseAccountCode,
      date: dto.date,
      value: paymentTitle.originalValue
    });

    const paymentTitleMovement = await this.paymentTitleMovementsService.createCancellationMovement({
      date: dto.date,
      paymentTitleId: dto.paymentTitleId,
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

  public async createPurchaseReversal(dto: CreatePurchaseReversalDto): Promise<AccountingOperationResponseDto> {
    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId)
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId)
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
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
      value: paymentTitle.openValue
    });

    const paymentMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: paymentMethod.accountCode,
      date: dto.date,
      value: paymentTitle.originalValue - paymentTitle.openValue
    });

    const paymentTitleMovement = await this.paymentTitleMovementsService.createReversalMovement({
      date: dto.date,
      paymentMethodId: dto.paymentMethodId,
      paymentTitleId: dto.paymentTitleId,
      transactionMappingId: paymentMapping.id,
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
  //#endregion Purchase

  //#region Sale
  public async createSale(dto: CreateSaleDto): Promise<AccountingOperationResponseDto> {
    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const merchandiseAccountCode = '1.1.4.01';
    const receivableTitleAccountCode = '1.1.3.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: receivableTitleAccountCode,
      date: dto.date,
      value: dto.saleValue
    });

    const merchandiseMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: merchandiseAccountCode,
      date: dto.date,
      value: dto.originalValue
    });

    const receivableTitleMovement = await this.receivableTitleMovementsService.createIssuingMovement({
      ...dto.receivableTitle,
      issuingDate: dto.date,
      value: dto.saleValue,
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
      receivableTitleMovement
    };
  }

  public async createSalePayment(dto: CreateSalePaymentDto): Promise<AccountingOperationResponseDto> {
    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId)
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId)
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const receivableTitleAccountCode = '1.1.3.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: receivableTitleAccountCode,
      date: dto.date,
      value: dto.paidValue
    });

    const paymentMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: paymentMethod.accountCode,
      date: dto.date,
      value: (dto.paidValue || 0) + (dto.interestValue || 0) + (dto.fineValue || 0)
    });

    const receivableTitleMovement = await this.receivableTitleMovementsService.createPaymentMovement({
      date: dto.date,
      fineValue: dto.fineValue,
      interestValue: dto.interestValue,
      paidValue: dto.paidValue,
      paymentMethodId: dto.paymentMethodId,
      receivableTitleId: dto.receivableTitleId,
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
      receivableTitleMovement
    };
  }

  public async createSaleCancellation(dto: CreateSaleCancellationDto): Promise<AccountingOperationResponseDto> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId)
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const merchandiseAccountCode = '1.1.4.01';
    const receivableTitleAccountCode = '1.1.3.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: receivableTitleAccountCode,
      date: dto.date,
      value: receivableTitle.originalValue
    });

    const titleMovements = await this.receivableTitleMovementsService.findByTitleId(dto.receivableTitleId);
    const issuingMovement = titleMovements.filter(m => m.type === ReceivableTitleMovementType.Issuing)?.[0];

    if (!issuingMovement) {
      throw new NotFoundException('Issuing movement not found');
    }

    const issuingTransactionMappings = await this.transactionMappingsService
      .findByTransactionCode(issuingMovement.transactionMapping.transactionCode);
    const originalMerchandiseMapping = issuingTransactionMappings.filter(m => m.accountCode === merchandiseAccountCode)?.[0];

    if (!originalMerchandiseMapping) {
      throw new NotFoundException('Original merchandise transaction mapping not found');
    }

    const merchandiseMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: merchandiseAccountCode,
      date: dto.date,
      value: originalMerchandiseMapping.value
    });

    const receivableTitleMovement = await this.receivableTitleMovementsService.createCancellationMovement({
      date: dto.date,
      receivableTitleId: dto.receivableTitleId,
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
      receivableTitleMovement
    };
  }

  public async createSaleReversal(dto: CreateSaleReversalDto): Promise<AccountingOperationResponseDto> {
    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId)
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId)
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    const transaction = await this.transactionsService.create({
      code: dto.transactionCode,
      name: dto.transactionName
    });

    const receivableTitleAccountCode = '1.1.3.01';

    const titleMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: receivableTitleAccountCode,
      date: dto.date,
      value: receivableTitle.openValue
    });

    const paymentMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Credit,
      accountCode: paymentMethod.accountCode,
      date: dto.date,
      value: receivableTitle.originalValue - receivableTitle.openValue
    });

    const receivableTitleMovement = await this.receivableTitleMovementsService.createReversalMovement({
      date: dto.date,
      paymentMethodId: dto.paymentMethodId,
      receivableTitleId: dto.receivableTitleId,
      transactionMappingId: paymentMapping.id,
    });

    const titleMappingWithAccount = await this.transactionMappingsService.findOne(titleMapping.id, ['account']);
    const paymentMappingWithAccount = await this.transactionMappingsService.findOne(paymentMapping.id, ['account']);

    return {
      transaction,
      mappings: [
        titleMappingWithAccount,
        paymentMappingWithAccount
      ],
      receivableTitleMovement
    };
  }
  //#endregion Sale
}
