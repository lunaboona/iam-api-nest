import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Entity()
export class Transaction {
  @PrimaryColumn({ length: 10 })
  code: string;

  @Column()
  name: string;

  public fillFields(dto: CreateTransactionDto) {
    this.code = dto.code;
    this.name = dto.name;
  }
}
