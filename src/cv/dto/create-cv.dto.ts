import { IsNumber, IsString } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

  // Change to DeepPartial<User>
  user: DeepPartial<User>;  // Allows passing either full or partial user object
}
