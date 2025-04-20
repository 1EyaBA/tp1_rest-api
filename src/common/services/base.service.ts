import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ObjectLiteral, DeepPartial } from 'typeorm';
import { IBaseService } from '../interfaces/base.service.interface';

@Injectable()
export class BaseService<T extends ObjectLiteral> implements IBaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async update(id: number, updateDto: DeepPartial<T>): Promise<T> {
    const existing = await this.findOne(id);
    const updated = this.repository.merge(existing, updateDto);
    return await this.repository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
