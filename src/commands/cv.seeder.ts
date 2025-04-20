import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CvService } from '../cv/cv.service';
import { SkillService } from '../skill/skill.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCvDto } from '../cv/dto/create-cv.dto';
import { CreateSkillDto } from '../skill/dto/create-skill.dto';

import {
  randFullName,
  randEmail,
  randUserName,
  randPassword,
  randJobTitle,
  randNumber,
  randSkill,
} from '@ngneat/falso';



async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const cvService = app.get(CvService);
  const skillService = app.get(SkillService);

  try {
    for (let i = 0; i < 5; i++) {

      const userDto: CreateUserDto = {
        username: randUserName(),
        email: randEmail(),
        password: randPassword()[0], // correction ici
      };
      const user = await userService.create(userDto);

      for (let j = 0; j < 2; j++) {

        const cvDto: CreateCvDto = {
          name: randFullName(),
          firstname: randFullName(),
          age: randNumber({ min: 22, max: 45 }),
          Cin: 'CIN' + randNumber({ min: 1000, max: 9999 }),
          job: randJobTitle(),
          path: 'path/to/cv',
          user: { id: user.id },
        };

        const cv = await cvService.create(cvDto);


        const skillIds: number[] = [];
        for (let k = 0; k < 3; k++) {
          const skillDto: CreateSkillDto = {
            designation: randSkill(),
          };

          const skill = await skillService.create(skillDto);
          skillIds.push(skill.id);
        }

      }
    }

    console.log(`Seed terminé avec :
  - 5 utilisateurs
  - 10 CVs (2 par utilisateur)
  - 30 skills (3 par CV)`);
  } catch (error) {
    console.error('Une erreur est survenue pendant le seed :', error);
  } finally {
    await app.close();
  }
}

bootstrap();
