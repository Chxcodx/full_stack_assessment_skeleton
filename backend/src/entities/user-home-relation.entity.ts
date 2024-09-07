import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../entities/user.entity';
import { Home } from '../entities/home.entity';

@Entity('user_home_relation')
export class UserHomeRelation {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  home_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Home)
  @JoinColumn({ name: 'home_id' })
  home: Home;
}
