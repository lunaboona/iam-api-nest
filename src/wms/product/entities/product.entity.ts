import { Movement } from '../../movement/entities/movement.entity';
import { ProductDefinition } from '../../product-definitions/entities/product-definition.entity';
import { Warehouse } from '../../warehouses/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  expirationDate: string;

  @Column({ type: 'date' })
  manufacturingDate: string;

  @Column()
  batch: string;

  @Column({ type: 'uuid' })
  productDefinitionId: string;

  @ManyToOne(
    () => ProductDefinition,
    (productDefinition) => productDefinition.products,
  )
  @JoinColumn({ name: 'productDefinitionId' })
  productDefinition: ProductDefinition;

  @Column({ type: 'uuid', nullable: true })
  warehouseId: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @ManyToMany(() => Movement, (movement) => movement.products)
  movements: Movement[];
}
