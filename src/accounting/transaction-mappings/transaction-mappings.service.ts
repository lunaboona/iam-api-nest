import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryRunner, Repository } from 'typeorm';
import { GetBalanceSheetDto } from '../dto/get-balance-sheet.dto';
import { CreateTransactionMappingDto } from './dto/create-transaction-mapping.dto';
import { TransactionMapping } from './entities/transaction-mapping.entity';

@Injectable()
export class TransactionMappingsService {
  constructor(
    @InjectRepository(TransactionMapping)
    private transactionMappingsRepository: Repository<TransactionMapping>,
  ) {}

  public async create(dto: CreateTransactionMappingDto, queryRunner: QueryRunner): Promise<TransactionMapping> {
    const transactionMapping = new TransactionMapping();
    transactionMapping.fillFields(dto);

    return await queryRunner.manager.save(transactionMapping);
  }

  public async findAll(): Promise<TransactionMapping[]> {
    return await this.transactionMappingsRepository.find();
  }

  public async findAllForBalanceSheet(dto: GetBalanceSheetDto): Promise<TransactionMapping[]> {
    return await this.transactionMappingsRepository.find({
      where: {
        accountCode: dto.accountCode,
        date: Between(new Date(dto.startDate), new Date(dto.endDate))
      },
      relations: ['transaction', 'account']
    });
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
