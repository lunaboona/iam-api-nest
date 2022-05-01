import { ProductDefinition } from 'src/product-definitions/entities/product-definition.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  manifacturingDate: string;

  @Column()
  batch: string;

  @Column({ type: 'uuid' })
  productDefinitionId: string;

  @ManyToOne(() => ProductDefinition)
  @JoinColumn({ name: 'productDefinitionId' })
  productDefinition: ProductDefinition;

  @Column({ type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;
}
