import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Home } from '../entities/home.entity';
import { UserHomeRelation } from '../entities/user-home-relation.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private homeRepository: Repository<Home>,
    @InjectRepository(UserHomeRelation)
    private userHomeRelationRepository: Repository<UserHomeRelation>,
    @InjectRepository(User)
    private userRepository: Repository<Home>,
  ) {}

  async findByUser(userId: number, page: number = 1, limit: number = 50) {
    try {
      // Calculate offset for pagination
      const skip = (page - 1) * limit;

      // Fetch the relations based on user ID, with pagination
      const [homes, totalCount] =
        await this.userHomeRelationRepository.findAndCount({
          where: { user_id: userId },
          relations: ['home'],
          skip,
          take: limit,
        });
      // Check if relations are found
      if (!homes || homes?.length === 0) {
        throw new NotFoundException(
          `No homes found for user ID ${userId} on page ${page}`,
        );
      }
      return { homes, totalCount };
    } catch (error) {
      // Handle errors and return a proper error message
      throw new InternalServerErrorException(
        `Failed to retrieve homes for user ID ${userId}: ${error?.message}`,
      );
    }
  }

  async updateUsersForHome(homeId: number, userIds: number[]): Promise<string> {
    try {
      // Check if the home exists
      const home = await this.homeRepository.findOne({ where: { id: homeId } });
      if (!home) {
        throw new NotFoundException(`Home with id ${homeId} not found.`);
      }

      // Find the users using the new method
      const users = await this.userRepository.findBy({
        id: In(userIds),
      });

      if (users?.length !== userIds?.length) {
        throw new NotFoundException('users not found');
      }

      // Delete existing user-home relations for the home
      await this.userHomeRelationRepository.delete({ home_id: homeId });

      // Insert new user-home relations
      const relations = userIds.map((userId) => ({
        user_id: userId,
        home_id: homeId,
      }));
      await this.userHomeRelationRepository.save(relations);

      return 'updated successfully.';
    } catch (error) {
      // Handle specific errors
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Log and rethrow a generic error for unexpected issues
      throw new InternalServerErrorException(
        'An error occurred while updating users for the home',
      );
    }
  }
}
