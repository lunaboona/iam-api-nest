import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { ReceivableTitleStatus } from '../receivable-titles/enum/receivable-title-status.enum';
import { ReceivableTitlesService } from '../receivable-titles/receivable-titles.service';
import { TransactionMappingsService } from '../transaction-mappings/transaction-mappings.service';
import { CreateCancellationMovementDto } from './dto/create-cancellation-movement.dto';
import { CreateIssuingMovementDto } from './dto/create-issuing-movement.dto';
import { CreatePaymentMovementDto } from './dto/create-payment-movement.dto';
import { CreateReceivableTitleMovementDto } from './dto/create-receivable-title-movement.dto';
import { CreateReversalMovementDto } from './dto/create-reversal-movement.dto';
import { ReceivableTitleMovement } from './entities/receivable-title-movement.entity';
import { ReceivableTitleMovementType } from './enum/receivable-title-movement-type.enum';

@Injectable()
export class ReceivableTitleMovementsService {
  constructor(
    @InjectRepository(ReceivableTitleMovement)
    private receivableTitleMovementsRepository: Repository<ReceivableTitleMovement>,
    private receivableTitlesService: ReceivableTitlesService,
    private paymentMethodsService: PaymentMethodsService,
    private transactionMappingsService: TransactionMappingsService
  ) {}

  public async create(createReceivableTitleMovementDto: CreateReceivableTitleMovementDto): Promise<ReceivableTitleMovement> {
    let receivableTitleMovement = new ReceivableTitleMovement();
    receivableTitleMovement = { ...receivableTitleMovement, ...createReceivableTitleMovementDto };

    return await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
  }

  public async createIssuingMovement(dto: CreateIssuingMovementDto): Promise<ReceivableTitleMovement> {
    if (!dto.value) {
      throw new BadRequestException();
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException();
    }

    // Possíveis validações
    // pode abrir um título com data de vencimento no passado?

    const receivableTitle = await this.receivableTitlesService.create({
      name: dto.name,
      dueDate: dto.dueDate,
      openValue: dto.value,
      originalValue: dto.value,
      payer: dto.payer,
      recipient: dto.recipient,
      status: ReceivableTitleStatus.Open
    })

    const receivableTitleMovement: ReceivableTitleMovement = {
      ...(new ReceivableTitleMovement()),
      type: ReceivableTitleMovementType.Issuing,
      date: dto.issuingDate,
      receivableTitleId: receivableTitle.id,
      transactionMappingId: dto.transactionMappingId
    };

    const createdReceivableTitleMovement = await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
    return await this.findOne(createdReceivableTitleMovement.id, true);
  }

  public async createCancellationMovement(dto: CreateCancellationMovementDto): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException();
    }

    if (
      receivableTitle.status !== ReceivableTitleStatus.Open
      || receivableTitle.originalValue !== receivableTitle.openValue
    ) {
      throw new BadRequestException();
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException();
    }

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: 0,
        status: ReceivableTitleStatus.Cancelled
      }
    );

    const receivableTitleMovement: ReceivableTitleMovement = {
      ...(new ReceivableTitleMovement()),
      type: ReceivableTitleMovementType.Cancellation,
      date: dto.date,
      receivableTitleId: updatedReceivableTitle.id,
      transactionMappingId: dto.transactionMappingId
    };

    const createdReceivableTitleMovement = await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
    return await this.findOne(createdReceivableTitleMovement.id, true);
  }

  public async createPaymentMovement(dto: CreatePaymentMovementDto): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException();
    }

    if (receivableTitle.status !== ReceivableTitleStatus.Open) {
      throw new BadRequestException();
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException();
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException();
    }

    receivableTitle.openValue -= dto.paidValue;

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: receivableTitle.openValue,
        status: receivableTitle.openValue > 0 ? ReceivableTitleStatus.Open : ReceivableTitleStatus.Settled
      }
    );

    const receivableTitleMovement: ReceivableTitleMovement = {
      ...(new ReceivableTitleMovement()),
      type: ReceivableTitleMovementType.Payment,
      date: dto.date,
      paidValue: dto.paidValue,
      fineValue: dto.fineValue,
      interestValue: dto.interestValue,
      receivableTitleId: updatedReceivableTitle.id,
      paymentMethodId: dto.paymentMethodId,
      transactionMappingId: dto.transactionMappingId
    }

    const createdReceivableTitleMovement = await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
    return await this.findOne(createdReceivableTitleMovement.id, true);
  }

  public async createReversalMovement(dto: CreateReversalMovementDto): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException();
    }

    if (
      receivableTitle.status === ReceivableTitleStatus.Cancelled
      || receivableTitle.originalValue === receivableTitle.openValue
    ) {
      throw new BadRequestException();
    }

    const transactionMapping = await this.transactionMappingsService.findOne(dto.transactionMappingId);
    if (!transactionMapping) {
      throw new NotFoundException();
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException();
    }

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: 0,
        status: ReceivableTitleStatus.Cancelled
      }
    );

    const receivableTitleMovement: ReceivableTitleMovement = {
      ...(new ReceivableTitleMovement()),
      type: ReceivableTitleMovementType.Reversal,
      date: dto.date,
      receivableTitleId: updatedReceivableTitle.id,
      paymentMethodId: dto.paymentMethodId,
      transactionMappingId: dto.transactionMappingId
    }

    const createdReceivableTitleMovement = await this.receivableTitleMovementsRepository.save(receivableTitleMovement);
    return await this.findOne(createdReceivableTitleMovement.id, true);
  }

  public async findAll(): Promise<ReceivableTitleMovement[]> {
    return await this.receivableTitleMovementsRepository.find();
  }

  public async findByTitleId(receivableTitleId: string): Promise<ReceivableTitleMovement[]> {
    return await this.receivableTitleMovementsRepository.find({
      where: { receivableTitleId },
      relations: ['transactionMapping']
    });
  }

  public async findOne(id: string, expand: boolean = false): Promise<ReceivableTitleMovement> {
    let relations = [];
    if (expand) {
      relations = ['receivableTitle', 'paymentMethod'];
    }
    return await this.receivableTitleMovementsRepository.findOne(id, { relations });
  }
}
