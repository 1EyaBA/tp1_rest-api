import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'; // Import Repository
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { BaseService } from '../common/services/base.service'; // Assuming BaseService is in a common folder
import { Skill } from './entities/skill.entity'; // Assuming Skill entity exists
import { InjectRepository } from '@nestjs/typeorm'; // Import InjectRepository

@Injectable()
export class SkillService extends BaseService<Skill> { 
  // Extending BaseService to inherit CRUD operations
  constructor(
    @InjectRepository(Skill) // Inject the User repository here
    protected readonly repository: Repository<Skill>,
  ) {
    super(repository);
  }



}
