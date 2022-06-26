import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  public async create(dto: CreateTransactionDto): Promise<Transaction> {
    if (!dto.code) {
      throw new BadRequestException();
    }

    if (await this.findOne(dto.code)) {
      throw new ConflictException();
    }

    let transaction = new Transaction();
    transaction = { ...transaction, ...dto };

    return await this.transactionsRepository.save(transaction);
  }

  public async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  public async findOne(code: string): Promise<Transaction> {
    return await this.transactionsRepository.findOne(code);
  }
}
