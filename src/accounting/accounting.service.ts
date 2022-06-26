import { Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseResponseDto } from './dto/purchase-response.dto';
import { PaymentTitleMovementsService } from './payment-title-movements/payment-title-movements.service';
import { TransactionMethod } from './transaction-mappings/enum/transaction-method.enum';
import { TransactionMappingsService } from './transaction-mappings/transaction-mappings.service';
import { TransactionsService } from './transactions/transactions.service';

@Injectable()
export class AccountingService {

  constructor(
    private transactionsService: TransactionsService,
    private transactionMappingsService: TransactionMappingsService,
    private paymentTitleMovementsService: PaymentTitleMovementsService
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
      accountCode: paymentTitleAccountCode
    });

    const merchandiseMapping = await this.transactionMappingsService.create({
      transactionCode: dto.transactionCode,
      method: TransactionMethod.Debit,
      accountCode: merchandiseAccountCode
    });

    const paymentTitleMovement = await this.paymentTitleMovementsService.createIssuingMovement({
      ...dto.paymentTitle,
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
}
