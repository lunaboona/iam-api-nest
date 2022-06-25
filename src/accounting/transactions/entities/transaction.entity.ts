import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn({ length: 10 })
  code: string;

  @Column()
  name: string;
}
