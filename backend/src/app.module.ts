import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { HomeController } from './home/home.controller';
import { UserService } from './user/user.service';
import { HomeService } from './home/home.service';
import { User } from './entities/user.entity';
import { Home } from './entities/home.entity';
import { UserHomeRelation } from './entities/user-home-relation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'db_user',
      password: '6equj5_db_user',
      database: 'home_db',
      entities: [User, Home, UserHomeRelation],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Home, UserHomeRelation]),
  ],
  controllers: [UserController, HomeController],
  providers: [UserService, HomeService],
})
export class AppModule {}
