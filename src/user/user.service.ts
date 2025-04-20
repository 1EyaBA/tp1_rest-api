import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from '../common/services/base.service'; // Assuming the base service is used here
import { User } from './entities/user.entity'; // Assuming a User entity exists
import { Repository } from 'typeorm'; // Importing Repository from TypeORM
import { InjectRepository } from '@nestjs/typeorm'; // Importing InjectRepository for dependency injection

@Injectable()
export class UserService extends BaseService<User> { // Extending BaseService to inherit CRUD operations
  constructor(
    @InjectRepository(User) // Inject the User repository here
    protected readonly repository: Repository<User>,
  ) {
    super(repository); // Call the constructor of the base service with the repository
  }

  create(createUserDto: CreateUserDto) {
    return super.create(createUserDto);
  }

  findAll() {
    return super.findAll();
  }

  findOne(id: number) {
    return super.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return super.update(id, updateUserDto);
  }

  remove(id: number) {
    return super.remove(id);
  }
}
