// base.service.interface.ts
import { DeepPartial } from 'typeorm';

export interface IBaseService<T> {
  create(createDto: DeepPartial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, updateDto: any): Promise<T>;
  remove(id: number): Promise<void>;
}
