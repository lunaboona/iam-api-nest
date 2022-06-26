import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryColumn({ length: 10 })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentCode?: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'parentCode' })
  parent?: Account;
}
