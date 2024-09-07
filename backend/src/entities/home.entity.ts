import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../entities/user.entity';

@Entity('home')
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street_address: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  sqft: number;

  @Column()
  beds: number;

  @Column()
  baths: number;

  @Column()
  list_price: number;

  @ManyToMany(() => User, (user) => user.homes)
  @JoinTable()
  users: User[];
}
