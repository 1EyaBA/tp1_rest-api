import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { BaseService } from '../common/services/base.service';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import { Skill } from '../skill/entities/skill.entity';
import { FilterCvDto } from './dto/filter-cv.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from '@ngneat/falso';

@Injectable()
export class CvService extends BaseService<Cv> {
  constructor(
    @InjectRepository(Cv)
    protected readonly repository: Repository<Cv>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private readonly paginationService: PaginationService
  ) {
    super(repository);
  }

  create(createCvDto: CreateCvDto) {
    const createCvEntity: DeepPartial<Cv> = {
      ...createCvDto,
      user: { id: createCvDto.user.id },
    };
    return super.create(createCvEntity);
  }

  async filterCv(filter: FilterCvDto) {
    const { age, critere } = filter;

    const query = this.repository.createQueryBuilder('cv');

    if (critere) {
      query.andWhere(
        '(cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere)',
        { critere: `%${critere}%` },
      );
    }

    if (age) {
      query.andWhere('cv.age = :age', { age });
    }

    return await query.getMany();
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const queryBuilder = this.repository.createQueryBuilder('cv');
    paginationDto.queryBuilder = queryBuilder;
    return this.paginationService.paginate(paginationDto);
  }

  async filterCvWithPagination(filter: FilterCvDto, paginationDto: PaginationDto) {
    const { age, critere } = filter;
    const query = this.repository.createQueryBuilder('cv');

    if (critere) {
      query.andWhere(
        '(cv.name LIKE :critere OR cv.firstname LIKE :critere OR cv.job LIKE :critere)',
        { critere: `%${critere}%` },
      );
    }

    if (age) {
      query.andWhere('cv.age = :age', { age });
    }

    paginationDto.queryBuilder = query;
    return this.paginationService.paginate(paginationDto);
  }


  async updateCvPath(id: number, path: string) {
    const cv = await this.repository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    cv.path = path;
    return this.repository.save(cv);
  }

  async updateCv(id: number, cvDto: UpdateCvDto, userId: number) {
    const cv = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cv || cv.user.id !== userId) {
      throw new ForbiddenException('You can only update your own CVs.');
    }

    return this.repository.save({ ...cv, ...cvDto });
  }

  async deleteCv(id: number, userId: number) {
    const cv = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!cv || cv.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own CVs.');
    }

    return this.repository.delete(id);
  }

  async addImageToCv(cvId: number, imagePath: string): Promise<Cv> {
    const cv = await this.repository.findOneBy({ id: cvId });

    if (!cv) {
      throw new NotFoundException(`CV with id ${cvId} not found`);
    }

    cv.path = imagePath;

    return this.repository.save(cv);
  }
  async findByUserId(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
  async findOneWithRelations(id: number, relations: string[] = ['user']): Promise<Cv> {
    const cv = await this.repository.findOne({
      where: { id },
      relations,
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    return cv;
  }


}
