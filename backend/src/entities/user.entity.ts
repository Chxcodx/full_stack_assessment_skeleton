import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Home } from '../entities/home.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @ManyToMany(() => Home, (home) => home.users)
  homes: Home[];
}
