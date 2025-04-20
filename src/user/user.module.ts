import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Assuming User entity exists
import { Cv } from '../cv/entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Cv,Skill])], 
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  
}
