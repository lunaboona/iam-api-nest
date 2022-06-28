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
import { MovementDefinition } from '../../movement-definitions/entities/movement-definition.entity';
import { Product } from '../../product/entities/product.entity';
import { CreateMovementDto } from './../dto/create-movement.dto';
import { Transaction } from 'src/accounting/transactions/entities/transaction.entity';

@Entity()
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  totalPrice: number;

  @Column({ type: 'datetime' })
  dateTime: Date;

  @Column()
  document: string;

  @Column({ type: 'uuid' })
  movementDefinitionId: string;

  @ManyToOne(() => MovementDefinition)
  @JoinColumn({ name: 'movementDefinitionId' })
  movementDefinition: MovementDefinition;

  @Column({ type: 'uuid', nullable: true })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @ManyToMany(() => Product, (product) => product.movements)
  @JoinTable()
  products: Product[];

  @Column({ nullable: true })
  transactionCode?: string;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transactionCode' })
  transaction?: Transaction;

  public fillFields(createMovement: CreateMovementDto, products: Product[]) {
    this.totalPrice = createMovement.totalPrice;
    this.dateTime = createMovement.dateTime;
    this.document = createMovement.document;
    this.movementDefinitionId = createMovement.movementDefinitionId;
    this.warehouseId = createMovement.warehouseId;
    this.transactionCode = createMovement.transactionCode;
    this.products = products;
  }
}
