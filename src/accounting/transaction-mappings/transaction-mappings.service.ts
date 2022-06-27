import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionMappingDto } from './dto/create-transaction-mapping.dto';
import { TransactionMapping } from './entities/transaction-mapping.entity';

@Injectable()
export class TransactionMappingsService {
  constructor(
    @InjectRepository(TransactionMapping)
    private transactionMappingsRepository: Repository<TransactionMapping>,
  ) {}

  public async create(createTransactionMappingDto: CreateTransactionMappingDto): Promise<TransactionMapping> {
    let transactionMapping = new TransactionMapping();
    transactionMapping = { ...transactionMapping, ...createTransactionMappingDto };

    return await this.transactionMappingsRepository.save(transactionMapping);
  }

  public async findAll(): Promise<TransactionMapping[]> {
    return await this.transactionMappingsRepository.find();
  }

  public async findOne(id: string, relations: string[] = []): Promise<TransactionMapping> {
    return await this.transactionMappingsRepository.findOne(id, { relations });
  }

  public async findByTransactionCode(transactionCode): Promise<TransactionMapping[]> {
    return await this.transactionMappingsRepository.find({
      where: { transactionCode }
    })
  }
}
