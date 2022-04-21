import { Operation } from 'src/operations/entities/operation.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User {
  constructor(createUserDto: CreateUserDto) {
    this.id = createUserDto.id;
    this.name = createUserDto.name;
    this.username = createUserDto.username;
    this.email = createUserDto.email;
    this.passwordHash = createUserDto.passwordHash;
    this.active = createUserDto.active;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  active: boolean;

  @ManyToMany(() => Operation, (m) => m.users)
  @JoinTable()
  operations: Operation[];
}
