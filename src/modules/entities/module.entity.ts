import { Operation } from 'src/operations/entities/operation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'module' })
export class ModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Operation, (o) => o.module, { onDelete: 'CASCADE' })
  operations: Operation[];
}
