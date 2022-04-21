import { Operation } from 'src/operations/entities/operation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';

@Entity({ name: 'module' })
export class ModuleEntity {
  constructor(createModuleDto: CreateModuleDto) {
    this.id = createModuleDto.id;
    this.name = createModuleDto.name;
    this.icon = createModuleDto.icon;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Operation, (o) => o.module, { onDelete: 'CASCADE' })
  operations: Operation[];
}
