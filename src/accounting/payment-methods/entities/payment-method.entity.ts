import { Account } from 'src/accounting/accounts/entities/account.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  accountCode: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountCode' })
  account: Account;
}
