import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
