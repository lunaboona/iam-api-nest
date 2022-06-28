import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentTitleDto } from './dto/create-payment-title.dto';
import { UpdatePaymentTitleDto } from './dto/update-payment-title.dto';
import { PaymentTitle } from './entities/payment-title.entity';

@Injectable()
export class PaymentTitlesService {
  constructor(
    @InjectRepository(PaymentTitle)
    private paymentTitlesRepository: Repository<PaymentTitle>,
  ) {}

  public async create(createPaymentTitleDto: CreatePaymentTitleDto): Promise<PaymentTitle> {
    let paymentTitle = new PaymentTitle();
    paymentTitle = { ...paymentTitle, ...createPaymentTitleDto };

    return await this.paymentTitlesRepository.save(paymentTitle);
  }

  public async findAll(): Promise<PaymentTitle[]> {
    return await this.paymentTitlesRepository.find();
  }

  public async findOne(id: string): Promise<PaymentTitle> {
    if (!id) {
      throw new NotFoundException('Payment title does not exist');
    }
    return await this.paymentTitlesRepository.findOne(id);
  }

  public async update(id: string, dto: UpdatePaymentTitleDto): Promise<PaymentTitle> {
    let paymentTitle = await this.paymentTitlesRepository.findOne(id);
    if (!paymentTitle) {
      throw new NotFoundException('Payment title does not exist');
    }

    paymentTitle = {
      ...paymentTitle,
      ...dto
    };

    return await this.paymentTitlesRepository.save(paymentTitle);
  }
}
