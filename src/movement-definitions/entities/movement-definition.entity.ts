import { DocumentType } from 'src/document-types/entities/document-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovementNature } from '../enum/movement-nature.enum';

@Entity()
export class MovementDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid' })
  documentTypeId: string;

  @ManyToOne(() => DocumentType)
  @JoinColumn({ name: 'documentTypeId' })
  documentType: DocumentType;

  @Column({
    type: 'enum',
    enum: MovementNature,
    default: MovementNature.Incoming,
  })
  nature: MovementNature;

  @Column()
  isLoss: boolean;

  @Column()
  active: boolean;
}
