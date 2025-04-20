import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity'; 
import { User } from '../user/entities/user.entity';
import { Skill } from '../skill/entities/skill.entity';
import { CvControllerV2 } from './cv.controller.v2';
import { SkillService } from '../skill/skill.service';
import { PaginationService } from '../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cv,User,Skill])], 
  controllers: [CvController, CvControllerV2],
  providers: [CvService,SkillService,PaginationService],
})
export class CvModule {}
