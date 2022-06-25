import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReceivableTitleStatus } from '../enum/receivable-title-status.enum';

@Entity()
export class ReceivableTitle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  originalValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  openValue: number;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ length: 45 })
  payer: string;

  @Column({ length: 45 })
  recipient: string;

  @Column({
    type: 'enum',
    enum: ReceivableTitleStatus,
    default: ReceivableTitleStatus.Open,
  })
  status: ReceivableTitleStatus;
}
