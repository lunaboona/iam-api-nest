import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateDefaultAccountsReturnDto } from './dto/create-default-accounts-return.dto';
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

  public async findOne(code: string): Promise<Account> {
    return await this.accountsRepository.findOne(code);
  }

  public async findWithChildren(code: string): Promise<Account[]> {
    const parent = await this.findOne(code);
    const children = await this.accountsRepository.query(`SELECT * FROM ACCOUNT WHERE code LIKE '${code}.%'`);

    return [parent, ...children];
  }

  public async createDefaultAccounts(): Promise<CreateDefaultAccountsReturnDto> {
    const accounts: Account[] = [
      { code: '1', name: 'ATIVO' },
      { code: '1.1', name: 'CIRCULANTE', parentCode: '1' },
      { code: '1.1.1', name: 'Caixa', parentCode: '1.1' },
      { code: '1.1.1.01', name: 'Caixa Geral', parentCode: '1.1.1' },
      { code: '1.1.2', name: 'Bancos Conta Movimento', parentCode: '1.1' },
      { code: '1.1.2.01', name: 'Banco Alfa', parentCode: '1.1.2' },
      { code: '1.1.3', name: 'Contas a Receber', parentCode: '1.1' },
      { code: '1.1.3.01', name: 'Clientes', parentCode: '1.1.3' },
      { code: '1.1.4', name: 'Estoques', parentCode: '1.1' },
      { code: '1.1.4.01', name: 'Mercadoria', parentCode: '1.1.4' },
      { code: '1.2', name: 'NÃO CIRCULANTE', parentCode: '1' },
      { code: '1.2.1', name: 'Investimentos', parentCode: '1.2' },
      { code: '1.2.1.01', name: 'Participações Societárias', parentCode: '1.2.1' },
      { code: '1.2.2', name: 'Imobilizado', parentCode: '1.2' },
      { code: '1.2.2.01', name: 'Máquinas e Equipamentos', parentCode: '1.2.2' },
      { code: '1.2.3', name: 'Intangível', parentCode: '1.2' },
      { code: '1.2.3.01', name: 'Marcas e Patentes', parentCode: '1.2.3' },
      { code: '2', name: 'PASSIVO' },
      { code: '2.1', name: 'CIRCULANTE', parentCode: '2' },
      { code: '2.1.1', name: 'Impostos e Contribuições a Receber', parentCode: '2.1' },
      { code: '2.1.1.01', name: 'Simples a Recolher', parentCode: '2.1.1' },
      { code: '2.1.2', name: 'Contas a Pagar', parentCode: '2.1' },
      { code: '2.1.2.01', name: 'Fornecedores', parentCode: '2.1.2' },
      { code: '2.1.2.02', name: 'Outras Contas', parentCode: '2.1.2' },
      { code: '2.1.3', name: 'Empréstimos Bancários', parentCode: '2.1' },
      { code: '2.1.3.01', name: 'Banco Alfa', parentCode: '2.1.3' },
      { code: '2.2', name: 'NÃO CIRCULANTE', parentCode: '2' },
      { code: '2.2.1', name: 'Empréstimos Bancários', parentCode: '2.2' },
      { code: '2.2.1.01', name: 'Banco Alfa', parentCode: '2.2.1' },
      { code: '2.3', name: 'PATRIMÔNIO LÍQUIDO', parentCode: '2' },
      { code: '2.3.1', name: 'Capital Social', parentCode: '2.3' },
      { code: '2.3.1.01', name: 'Capital Social Integralizado', parentCode: '2.3.1',},
      { code: '2.3.2', name: 'Reservas', parentCode: '2.3' },
      { code: '2.3.2.01', name: 'Reservas de Capital', parentCode: '2.3.2' },
      { code: '2.3.2.02', name: 'Reservas de Lucros', parentCode: '2.3.2' }
    ];

    const skipped = [];

    console.log(':)');
    for (const account of accounts) {
      if (await this.findOne(account.code)) {
        skipped.push(account);
      } else {
        await this.accountsRepository.save(account);
      }
    }

    return { skipped };
  }
}
