import { DocumentType } from 'src/document-types/entities/document-type.entity';
import { MovementType } from 'src/movement-types/entities/movement-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'uuid' })
  movementTypeId: string;

  @ManyToOne(() => MovementType)
  @JoinColumn({ name: 'movementTypeId' })
  movementType: MovementType;
}
