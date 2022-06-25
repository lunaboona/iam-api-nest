import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  public async create(createAccountDto: CreateAccountDto): Promise<Account> {
    let account = new Account();
    account = { ...account, ...createAccountDto };

    return await this.accountsRepository.save(account);
  }

  public async findAll(): Promise<Account[]> {
    return await this.accountsRepository.find();
  }

  public async findOne(id: string): Promise<Account> {
    return await this.accountsRepository.findOne(id);
  }
}
