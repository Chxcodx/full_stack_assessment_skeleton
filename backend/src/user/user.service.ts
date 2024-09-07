import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserHomeRelation } from '../entities/user-home-relation.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserHomeRelation)
    private userHomeRelationRepository: Repository<UserHomeRelation>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch users from the database',
      );
    }
  }

  async findByHome(homeId: number): Promise<User[]> {
    try {
      const relations = await this.userHomeRelationRepository.find({
        where: { home_id: homeId },
        relations: ['user'],
      });

      const users = relations.map((relation) => relation?.user);
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching users for the home',
      );
    }
  }
}
