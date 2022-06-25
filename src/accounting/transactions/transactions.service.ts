import { Injectable } from '@nestjs/common';
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

  public async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    let transaction = new Transaction();
    transaction = { ...transaction, ...createTransactionDto };

    return await this.transactionsRepository.save(transaction);
  }

  public async findAll(): Promise<Transaction[]> {
    return await this.transactionsRepository.find();
  }

  public async findOne(code: string): Promise<Transaction> {
    return await this.transactionsRepository.findOne(code);
  }
}
