import {
  Controller,
  Get,
  Param,
  Body,
  Query,
  Patch,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('find-by-user/:userId')
  async findByUser(
    @Param('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      // Default page to 1 and limit to 50 if not provided
      const pageNumber = page ? Number(page) : 1;
      const limitNumber = limit ? Number(limit) : 50;

      // Fetch the homes using the HomeService
      const homes = await this.homeService.findByUser(
        userId,
        pageNumber,
        limitNumber,
      );

      // Return the homes
      return homes;
    } catch (error) {
      // Return error response in case of failure
      throw new InternalServerErrorException(
        'Failed to retrieve homes for the user',
      );
    }
  }

  @Put('update-users/:homeId')
  async updateUsersForHome(
    @Param('homeId', ParseIntPipe) homeId: number,
    @Body('userIds') userIds: number[],
  ) {
    try {
      // Check if userIds array is valid
      if (!Array.isArray(userIds) || userIds?.length === 0) {
        throw new BadRequestException('Invalid userIds array.');
      }
      return await this.homeService.updateUsersForHome(homeId, userIds);
    } catch (error) {
      // Handle specific errors
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while updating users for the home.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
