import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTitleStatus } from '../payment-titles/enum/payment-title-status.enum';
import { PaymentTitlesService } from '../payment-titles/payment-titles.service';
import { CreateIssuingPaymentTitleMovementDto } from './dto/create-issuing-payment-title-movement.dto';
import { CreatePaymentTitleMovementDto } from './dto/create-payment-title-movement.dto';
import { PaymentTitleMovement } from './entities/payment-title-movement.entity';
import { PaymentTitleMovementType } from './enum/payment-title-movement-type.enum';

@Injectable()
export class PaymentTitleMovementsService {
  constructor(
    @InjectRepository(PaymentTitleMovement)
    private paymentTitleMovementsRepository: Repository<PaymentTitleMovement>,
    private paymentTitlesService: PaymentTitlesService
  ) {}

  public async create(createPaymentTitleMovementDto: CreatePaymentTitleMovementDto): Promise<PaymentTitleMovement> {
    let paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement = { ...paymentTitleMovement, ...createPaymentTitleMovementDto };

    return await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
  }

  public async createIssuingPaymentTitleMovement(dto: CreateIssuingPaymentTitleMovementDto): Promise<PaymentTitleMovement> {
    let paymentTitle = await this.paymentTitlesService.create({
      name: dto.name,
      dueDate: dto.dueDate,
      openValue: dto.value,
      originalValue: dto.value,
      payer: dto.payer,
      recipient: dto.recipient,
      status: PaymentTitleStatus.Open
    })

    let paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement = {
      ...paymentTitleMovement,
      type: PaymentTitleMovementType.Issuing,
      date: dto.issuingDate,
      fineValue: 0,
      interestValue: 0,
      paidValue: 0,
      paymentTitleId: paymentTitle.id,
    };

    const createdPaymentTitleMovement = await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
    return await this.findOne(createdPaymentTitleMovement.id, true);
  }

  public async findAll(): Promise<PaymentTitleMovement[]> {
    return await this.paymentTitleMovementsRepository.find();
  }

  public async findOne(id: string, expand: boolean = false): Promise<PaymentTitleMovement> {
    let relations = [];
    if (expand) {
      relations = ['paymentTitle'];
    }
    return await this.paymentTitleMovementsRepository.findOne(id, { relations });
  }
}
