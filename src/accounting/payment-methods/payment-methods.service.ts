import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodsRepository: Repository<PaymentMethod>,
  ) {}

  public async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    let paymentMethod = new PaymentMethod();
    paymentMethod = { ...paymentMethod, ...createPaymentMethodDto };

    return await this.paymentMethodsRepository.save(paymentMethod);
  }

  public async findAll(): Promise<PaymentMethod[]> {
    return await this.paymentMethodsRepository.find();
  }

  public async findOne(id: string): Promise<PaymentMethod> {
    if (!id) {
      throw new NotFoundException('Payment method does not exist');
    }
    return await this.paymentMethodsRepository.findOne(id);
  }
}
