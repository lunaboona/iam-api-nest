import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryColumn({ length: 10 })
  code: string;

  @Column()
  name: string;

  @Column()
  parentCode: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'parentCode' })
  parent: Account;
}
