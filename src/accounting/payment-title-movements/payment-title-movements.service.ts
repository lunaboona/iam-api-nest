import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentTitleMovementDto } from './dto/create-payment-title-movement.dto';
import { PaymentTitleMovement } from './entities/payment-title-movement.entity';

@Injectable()
export class PaymentTitleMovementsService {
  constructor(
    @InjectRepository(PaymentTitleMovement)
    private paymentTitleMovementsRepository: Repository<PaymentTitleMovement>,
  ) {}

  public async create(createPaymentTitleMovementDto: CreatePaymentTitleMovementDto): Promise<PaymentTitleMovement> {
    let paymentTitleMovement = new PaymentTitleMovement();
    paymentTitleMovement = { ...paymentTitleMovement, ...createPaymentTitleMovementDto };

    return await this.paymentTitleMovementsRepository.save(paymentTitleMovement);
  }

  public async findAll(): Promise<PaymentTitleMovement[]> {
    return await this.paymentTitleMovementsRepository.find();
  }

  public async findOne(id: string): Promise<PaymentTitleMovement> {
    return await this.paymentTitleMovementsRepository.findOne(id);
  }
}
