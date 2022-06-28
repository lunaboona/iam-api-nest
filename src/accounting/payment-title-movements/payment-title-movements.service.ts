import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { PaymentTitleStatus } from '../payment-titles/enum/payment-title-status.enum';
import { PaymentTitlesService } from '../payment-titles/payment-titles.service';
import { TransactionMappingsService } from '../transaction-mappings/transaction-mappings.service';
import { CreateCancellationMovementDto } from './dto/create-cancellation-movement.dto';
import { CreateIssuingMovementDto } from './dto/create-issuing-movement.dto';
import { CreatePaymentMovementDto } from './dto/create-payment-movement.dto';
import { CreateReversalMovementDto } from './dto/create-reversal-movement.dto';
import { PaymentTitleMovement } from './entities/payment-title-movement.entity';
import { PaymentTitleMovementType } from './enum/payment-title-movement-type.enum';

@Injectable()
export class PaymentTitleMovementsService {
  constructor(
    @InjectRepository(PaymentTitleMovement)
    private paymentTitleMovementsRepository: Repository<PaymentTitleMovement>,
    private paymentTitlesService: PaymentTitlesService,
    private paymentMethodsService: PaymentMethodsService,
    private transactionMappingsService: TransactionMappingsService
  ) {}

  public async createIssuingMovement(dto: CreateIssuingMovementDto): Promise<PaymentTitleMovement> {
    if (!dto.value) {
      throw new BadRequestException('Value must be greater than 0');
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException('Transaction mapping does not exist');
    }

    // Possíveis validações
    // pode abrir um título com data de vencimento no passado?

    const paymentTitle = await this.paymentTitlesService.create({
      name: dto.name,
      dueDate: dto.dueDate,
      openValue: dto.value,
      originalValue: dto.value,
      payer: dto.payer,
      recipient: dto.recipient,
      status: PaymentTitleStatus.Open
    })

    const paymentTitleMovement: PaymentTitleMovement = {
      ...(new PaymentTitleMovement()),
      type: PaymentTitleMovementType.Issuing,
      date: dto.issuingDate,
      paymentTitleId: paymentTitle.id,
      transactionMappingId: dto.transactionMappingId
    };

    const createdPaymentTitleMovement = await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
    return await this.findOne(createdPaymentTitleMovement.id, true);
  }

  public async createCancellationMovement(dto: CreateCancellationMovementDto): Promise<PaymentTitleMovement> {
    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId);
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    if (
      paymentTitle.status !== PaymentTitleStatus.Open
      || paymentTitle.originalValue !== paymentTitle.openValue
    ) {
      throw new BadRequestException('Payment title must have OPEN status and no payments');
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException('Transaction mapping does not exist');
    }

    const updatedPaymentTitle = await this.paymentTitlesService.update(
      dto.paymentTitleId,
      {
        openValue: 0,
        status: PaymentTitleStatus.Cancelled
      }
    );

    const paymentTitleMovement: PaymentTitleMovement = {
      ...(new PaymentTitleMovement()),
      type: PaymentTitleMovementType.Cancellation,
      date: dto.date,
      paymentTitleId: updatedPaymentTitle.id,
      transactionMappingId: dto.transactionMappingId
    };

    const createdPaymentTitleMovement = await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
    return await this.findOne(createdPaymentTitleMovement.id, true);
  }

  public async createPaymentMovement(dto: CreatePaymentMovementDto): Promise<PaymentTitleMovement> {
    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId);
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    if (paymentTitle.status !== PaymentTitleStatus.Open) {
      throw new BadRequestException('Payment title must have OPEN status');
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException('Transaction mapping does not exist');
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    paymentTitle.openValue -= dto.paidValue;

    const updatedPaymentTitle = await this.paymentTitlesService.update(
      dto.paymentTitleId,
      {
        openValue: paymentTitle.openValue,
        status: paymentTitle.openValue > 0 ? PaymentTitleStatus.Open : PaymentTitleStatus.Settled
      }
    );

    const paymentTitleMovement: PaymentTitleMovement = {
      ...(new PaymentTitleMovement()),
      type: PaymentTitleMovementType.Payment,
      date: dto.date,
      paidValue: dto.paidValue,
      fineValue: dto.fineValue,
      interestValue: dto.interestValue,
      paymentTitleId: updatedPaymentTitle.id,
      paymentMethodId: dto.paymentMethodId,
      transactionMappingId: dto.transactionMappingId
    }

    const createdPaymentTitleMovement = await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
    return await this.findOne(createdPaymentTitleMovement.id, true);
  }

  public async createReversalMovement(dto: CreateReversalMovementDto): Promise<PaymentTitleMovement> {
    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId);
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    if (
      paymentTitle.status === PaymentTitleStatus.Cancelled
      || paymentTitle.originalValue === paymentTitle.openValue
    ) {
      throw new BadRequestException('Payment title must not be CANCELLED and must have at least one payment');
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException('Transaction mapping does not exist');
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const updatedPaymentTitle = await this.paymentTitlesService.update(
      dto.paymentTitleId,
      {
        openValue: 0,
        status: PaymentTitleStatus.Cancelled
      }
    );

    const paymentTitleMovement: PaymentTitleMovement = {
      ...(new PaymentTitleMovement()),
      type: PaymentTitleMovementType.Reversal,
      date: dto.date,
      paymentTitleId: updatedPaymentTitle.id,
      paymentMethodId: dto.paymentMethodId,
      transactionMappingId: dto.transactionMappingId
    }

    const createdPaymentTitleMovement = await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
    return await this.findOne(createdPaymentTitleMovement.id, true);
  }

  public async findAll(): Promise<PaymentTitleMovement[]> {
    return await this.paymentTitleMovementsRepository.find();
  }

  public async findOne(id: string, expand: boolean = false): Promise<PaymentTitleMovement> {
    let relations = [];
    if (expand) {
      relations = ['paymentTitle', 'paymentMethod'];
    }
    return await this.paymentTitleMovementsRepository.findOne(id, { relations });
  }
}
