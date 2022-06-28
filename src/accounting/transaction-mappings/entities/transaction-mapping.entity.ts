import { Account } from 'src/accounting/accounts/entities/account.entity';
import { Transaction } from 'src/accounting/transactions/entities/transaction.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateTransactionMappingDto } from '../dto/create-transaction-mapping.dto';
import { TransactionMethod } from '../enum/transaction-method.enum';

@Entity()
export class TransactionMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  value: number;

  @Column()
  transactionCode: string;

  @ManyToOne(() => Transaction)
  @JoinColumn({ name: 'transactionCode' })
  transaction: Transaction;

  @Column()
  accountCode: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountCode' })
  account: Account;

  @Column({
    type: 'enum',
    enum: TransactionMethod,
    default: TransactionMethod.Credit,
  })
  method: TransactionMethod;

  public fillFields(dto: CreateTransactionMappingDto) {
    this.transactionCode = dto.transactionCode;
    this.accountCode = dto.accountCode;
    this.method = dto.method;
    this.date = dto.date;
    this.value = dto.value;
  }
}
