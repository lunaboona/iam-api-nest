import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { PaymentTitleStatus } from '../payment-titles/enum/payment-title-status.enum';
import { PaymentTitlesService } from '../payment-titles/payment-titles.service';
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
    private paymentMethodsService: PaymentMethodsService
  ) {}

  public async createIssuingMovement(dto: CreateIssuingMovementDto, queryRunner: QueryRunner): Promise<PaymentTitleMovement> {
    if (!dto.value) {
      throw new BadRequestException('Value must be greater than 0');
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
    }, queryRunner)

    const paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement.type = PaymentTitleMovementType.Issuing;
    paymentTitleMovement.date = dto.issuingDate;
    paymentTitleMovement.paymentTitleId = paymentTitle.id;
    paymentTitleMovement.transactionMappingId = dto.transactionMapping.id;

    return queryRunner.manager.save(paymentTitleMovement);
  }

  public async createCancellationMovement(dto: CreateCancellationMovementDto, queryRunner: QueryRunner): Promise<PaymentTitleMovement> {
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

    const updatedPaymentTitle = await this.paymentTitlesService.update(
      dto.paymentTitleId,
      {
        openValue: 0,
        status: PaymentTitleStatus.Cancelled
      },
      queryRunner
    );

    const paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement.type = PaymentTitleMovementType.Cancellation;
    paymentTitleMovement.date = dto.date;
    paymentTitleMovement.paymentTitleId = updatedPaymentTitle.id;
    paymentTitleMovement.transactionMappingId = dto.transactionMapping.id;

    return queryRunner.manager.save(paymentTitleMovement);
  }

  public async createPaymentMovement(dto: CreatePaymentMovementDto, queryRunner: QueryRunner): Promise<PaymentTitleMovement> {
    const paymentTitle = await this.paymentTitlesService.findOne(dto.paymentTitleId);
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    if (paymentTitle.status !== PaymentTitleStatus.Open) {
      throw new BadRequestException('Payment title must have OPEN status');
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
      }, queryRunner
    );

    const paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement.fillFields(dto);
    paymentTitleMovement.type = PaymentTitleMovementType.Payment;
    paymentTitleMovement.paymentTitleId = updatedPaymentTitle.id;

    return queryRunner.manager.save(paymentTitleMovement);
  }

  public async createReversalMovement(dto: CreateReversalMovementDto, queryRunner: QueryRunner): Promise<PaymentTitleMovement> {
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

    const paymentMethod = await this.paymentMethodsService.findOne(dto.paymentMethodId);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method does not exist');
    }

    const updatedPaymentTitle = await this.paymentTitlesService.update(
      dto.paymentTitleId,
      {
        openValue: 0,
        status: PaymentTitleStatus.Cancelled
      },
      queryRunner
    );

    const paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement.type = PaymentTitleMovementType.Reversal;
    paymentTitleMovement.date = dto.date;
    paymentTitleMovement.paymentTitleId = updatedPaymentTitle.id;
    paymentTitleMovement.paymentMethodId = dto.paymentMethodId;
    paymentTitleMovement.transactionMappingId = dto.transactionMapping.id;

    return queryRunner.manager.save(paymentTitleMovement);
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
