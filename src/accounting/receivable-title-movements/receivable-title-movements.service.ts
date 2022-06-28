import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { ReceivableTitleStatus } from '../receivable-titles/enum/receivable-title-status.enum';
import { ReceivableTitlesService } from '../receivable-titles/receivable-titles.service';
import { CreateCancellationMovementDto } from './dto/create-cancellation-movement.dto';
import { CreateIssuingMovementDto } from './dto/create-issuing-movement.dto';
import { CreatePaymentMovementDto } from './dto/create-payment-movement.dto';
import { CreateReversalMovementDto } from './dto/create-reversal-movement.dto';
import { ReceivableTitleMovement } from './entities/receivable-title-movement.entity';
import { ReceivableTitleMovementType } from './enum/receivable-title-movement-type.enum';

@Injectable()
export class ReceivableTitleMovementsService {
  constructor(
    @InjectRepository(ReceivableTitleMovement)
    private receivableTitleMovementsRepository: Repository<ReceivableTitleMovement>,
    private receivableTitlesService: ReceivableTitlesService,
    private paymentMethodsService: PaymentMethodsService
  ) {}

  public async createIssuingMovement(
    dto: CreateIssuingMovementDto,
    queryRunner: QueryRunner = null
  ): Promise<ReceivableTitleMovement> {
    if (!dto.value) {
      throw new BadRequestException('Value must be greater than 0');
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
    }, queryRunner)

    const receivableTitleMovement = new ReceivableTitleMovement();
    receivableTitleMovement.type = ReceivableTitleMovementType.Issuing,
    receivableTitleMovement.date = dto.issuingDate,
    receivableTitleMovement.receivableTitleId = receivableTitle.id,
    receivableTitleMovement.transactionMappingId = dto.transactionMapping.id

    return queryRunner.manager.save(receivableTitleMovement);
  }

  public async createCancellationMovement(dto: CreateCancellationMovementDto, queryRunner: QueryRunner = null): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    if (
      receivableTitle.status !== ReceivableTitleStatus.Open
      || receivableTitle.originalValue !== receivableTitle.openValue
    ) {
      throw new BadRequestException('Receivable title must have OPEN status and no payments');
    }

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: 0,
        status: ReceivableTitleStatus.Cancelled
      },
      queryRunner
    );

    const receivableTitleMovement = new ReceivableTitleMovement();
    receivableTitleMovement.type = ReceivableTitleMovementType.Cancellation,
    receivableTitleMovement.date = dto.date,
    receivableTitleMovement.receivableTitleId = updatedReceivableTitle.id,
    receivableTitleMovement.transactionMappingId = dto.transactionMapping.id

    return queryRunner.manager.save(receivableTitleMovement);
  }

  public async createPaymentMovement(dto: CreatePaymentMovementDto, queryRunner: QueryRunner = null): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    if (receivableTitle.status !== ReceivableTitleStatus.Open) {
      throw new BadRequestException('Receivable title must have OPEN status');
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    receivableTitle.openValue -= dto.paidValue;

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: receivableTitle.openValue,
        status: receivableTitle.openValue > 0 ? ReceivableTitleStatus.Open : ReceivableTitleStatus.Settled
      },
      queryRunner
    );

    const receivableTitleMovement = new ReceivableTitleMovement()
    receivableTitleMovement.type = ReceivableTitleMovementType.Payment,
    receivableTitleMovement.date = dto.date;
    receivableTitleMovement.paidValue = dto.paidValue;
    receivableTitleMovement.fineValue = dto.fineValue;
    receivableTitleMovement.interestValue = dto.interestValue;
    receivableTitleMovement.receivableTitleId = updatedReceivableTitle.id;
    receivableTitleMovement.paymentMethodId = dto.paymentMethodId;
    receivableTitleMovement.transactionMappingId = dto.transactionMapping.id;

    return queryRunner.manager.save(receivableTitleMovement);
  }

  public async createReversalMovement(dto: CreateReversalMovementDto, queryRunner: QueryRunner = null): Promise<ReceivableTitleMovement> {
    const receivableTitle = await this.receivableTitlesService.findOne(dto.receivableTitleId);
    if (!receivableTitle) {
      throw new NotFoundException('Receivable title does not exist');
    }

    if (
      receivableTitle.status === ReceivableTitleStatus.Cancelled
      || receivableTitle.originalValue === receivableTitle.openValue
    ) {
      throw new BadRequestException('Receivable title must not be CANCELLED and must have at least one payment');
    }

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const updatedReceivableTitle = await this.receivableTitlesService.update(
      dto.receivableTitleId,
      {
        openValue: 0,
        status: ReceivableTitleStatus.Cancelled
      },
      queryRunner
    );

    const receivableTitleMovement = new ReceivableTitleMovement();
    receivableTitleMovement.type = ReceivableTitleMovementType.Reversal;
    receivableTitleMovement.date = dto.date;
    receivableTitleMovement.receivableTitleId = updatedReceivableTitle.id;
    receivableTitleMovement.paymentMethodId = dto.paymentMethodId;
    receivableTitleMovement.transactionMappingId = dto.transactionMapping.id;

    return queryRunner.manager.save(receivableTitleMovement);
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
