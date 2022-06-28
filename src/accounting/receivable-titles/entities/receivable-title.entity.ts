import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateReceivableTitleDto } from '../dto/create-receivable-title.dto';
import { ReceivableTitleStatus } from '../enum/receivable-title-status.enum';

@Entity()
export class ReceivableTitle {
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
    enum: ReceivableTitleStatus,
    default: ReceivableTitleStatus.Open,
  })
  status: ReceivableTitleStatus;

  public fillFields(dto: CreateReceivableTitleDto) {
    this.name = dto.name;
    this.originalValue = dto.originalValue;
    this.openValue = dto.openValue;
    this.status = dto.status;
    this.dueDate = dto.dueDate;
    this.payer = dto.payer;
    this.recipient = dto.recipient;
  }
}
