import { ModuleEntity } from 'src/modules/entities/module.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  activityName: string;

  @ManyToMany(() => User, (u) => u.operations)
  users: User[];

  @Column({ type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => ModuleEntity, (m) => m.operations)
  @JoinColumn({ name: 'moduleId' })
  module: ModuleEntity;
}
