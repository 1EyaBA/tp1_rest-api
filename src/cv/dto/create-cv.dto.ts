import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsNumber()
  age: number;

  @IsString()
  Cin: string;

  @IsString()
  job: string;

  @IsString()
  path: string;


  user: DeepPartial<User>;


  @IsOptional()
  skills?: Skill[];
}
