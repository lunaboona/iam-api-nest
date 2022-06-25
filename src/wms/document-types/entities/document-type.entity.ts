import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DocumentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  /**
   * `0` - any digit
   * `a` - any letter
   * `*` - any char
   * `[]` - make input optional
   * If definition character should be treated as fixed it should be escaped by `\\` (e.g. `\\0`).
   */
  mask: string;

  @Column()
  active: boolean;
}
