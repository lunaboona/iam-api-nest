import { Movement } from '../../movement/entities/movement.entity';
import { Product } from '../../product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Product, (product) => product.warehouse)
  products: Product[];

  @OneToMany(() => Movement, (movement) => movement.warehouse)
  movements: Movement[];

  @Column()
  active: boolean;
}
