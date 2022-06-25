import { Account } from 'src/accounting/account/entities/account.entity';
import { Transaction } from 'src/accounting/transaction/entities/transaction.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionMethod } from '../enum/transaction-method.enum';

@Entity()
export class TransactionMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  nature: TransactionMethod;
}
