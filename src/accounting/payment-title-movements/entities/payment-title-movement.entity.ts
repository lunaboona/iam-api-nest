import { PaymentTitle } from 'src/accounting/payment-titles/entities/payment-title.entity';
import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTitleMovementType } from '../enum/payment-title-movement-type.enum';

@Entity()
export class PaymentTitleMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({
    type: 'enum',
    enum: PaymentTitleMovementType,
    default: PaymentTitleMovementType.Issuing,
  })
  type: PaymentTitleMovementType;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  paidValue: number;

  @Column()
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  interestValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  fineValue: number;

  @Column({ type: 'uuid' })
  paymentTitleId: string;

  @ManyToOne(() => PaymentTitle)
  @JoinColumn({ name: 'paymentTitleId' })
  paymentTitle: PaymentTitle;

  @Column({ type: 'uuid' })
  transactionMappingId: string;

  @ManyToOne(() => TransactionMapping)
  @JoinColumn({ name: 'transactionMappingId' })
  transactionMapping: TransactionMapping;
}
