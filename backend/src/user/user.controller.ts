import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find-all')
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Get('find-by-home/:homeId')
  async findByHome(@Param('homeId', ParseIntPipe) homeId: number) {
    try {
      const users = await this.userService.findByHome(homeId);
      return users?.length > 0
        ? users
        : { message: 'No users found for this home.' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve users for the home',
      );
    }
  }
}
