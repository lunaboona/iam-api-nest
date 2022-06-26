import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTitleStatus } from '../enum/payment-title-status.enum';

@Entity()
export class PaymentTitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  originalValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  openValue: number;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column()
  payer: string;

  @Column()
  recipient: string;

  @Column({
    type: 'enum',
    enum: PaymentTitleStatus,
    default: PaymentTitleStatus.Open,
  })
  status: PaymentTitleStatus;
}
