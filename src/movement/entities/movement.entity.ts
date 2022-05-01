import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './../../warehouses/entities/warehouse.entity';
import { MovementDefinition } from './../../movement-definitions/entities/movement-definition.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  totalPrice: number;

  @Column({ type: 'timestamptz' })
  dateTime: Date;

  @Column()
  document: string;

  @Column({ type: 'uuid' })
  movementDefinitionId: string;

  @ManyToOne(() => MovementDefinition)
  @JoinColumn({ name: 'movementDefinitionId' })
  movementDefinition: MovementDefinition;

  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
