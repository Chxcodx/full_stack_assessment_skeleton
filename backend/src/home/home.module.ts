import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { Home } from '../entities/home.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Home])],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
