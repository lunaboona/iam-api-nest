import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MovementTypeNature } from '../enum/movement-type-nature.enum';

@Entity()
export class MovementType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: MovementTypeNature,
    default: MovementTypeNature.Incoming,
  })
  nature: MovementTypeNature;
}
