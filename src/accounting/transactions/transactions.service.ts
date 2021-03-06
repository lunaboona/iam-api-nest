import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  public async create(dto: CreateTransactionDto, queryRunner: QueryRunner): Promise<Transaction> {
    if (!dto.code) {
      throw new BadRequestException('Transaction code must not be empty');
    }

    if (await this.findOne(dto.code)) {
      throw new ConflictException('Transaction code already in use');
    }

    const transaction = new Transaction();
    transaction.fillFields(dto);

    return await queryRunner.manager.save(transaction);
  }

  public async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  public async findOne(code: string): Promise<Transaction> {
    return await this.transactionsRepository.findOne(code);
  }
}
