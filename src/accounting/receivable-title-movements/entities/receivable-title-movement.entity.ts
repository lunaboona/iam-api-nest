import { PaymentMethod } from 'src/accounting/payment-methods/entities/payment-method.entity';
import { ReceivableTitle } from 'src/accounting/receivable-titles/entities/receivable-title.entity';
import { TransactionMapping } from 'src/accounting/transaction-mappings/entities/transaction-mapping.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReceivableTitleMovementType } from '../enum/receivable-title-movement-type.enum';

@Entity()
export class ReceivableTitleMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({
    type: 'enum',
    enum: ReceivableTitleMovementType,
    default: ReceivableTitleMovementType.Issuing,
  })
  type: ReceivableTitleMovementType;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  paidValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  interestValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  fineValue: number;

  @Column({ type: 'uuid' })
  receivableTitleId: string;

  @ManyToOne(() => ReceivableTitle)
  @JoinColumn({ name: 'receivableTitleId' })
  receivableTitle: ReceivableTitle;

  @Column({ type: 'uuid', nullable: true })
  transactionMappingId?: string;

  @ManyToOne(() => TransactionMapping, { nullable: true })
  @JoinColumn({ name: 'transactionMappingId' })
  transactionMapping?: TransactionMapping;

  @Column({ type: 'uuid', nullable: true })
  paymentMethodId?: string;

  @ManyToOne(() => PaymentMethod, { nullable: true })
  @JoinColumn({ name: 'paymentMethodId' })
  paymentMethod?: PaymentMethod;
}
