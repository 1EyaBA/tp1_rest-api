import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FilterCvDto } from './dto/filter-cv.dto';
import { Query } from '@nestjs/common/decorators/http/route-params.decorator';

import { PaginationDto } from 'src/common/dto/pagination.dto';
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

 


  
  @Post()
  create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }


  @Get()
  async findAll(@Query() filter: FilterCvDto) {
    return this.cvService.filterCv(filter);
  }

  @Get('all')
  async getAll(@Query() paginationDto: PaginationDto, @Query('paginated') paginated: boolean = false) {
    if (paginated) {
      return this.cvService.findAllPaginated(paginationDto);
    }
    return this.cvService.findAll();
  }

  @Get('filtered-paginated')
  getFilteredPaginated(@Query() filter: FilterCvDto, @Query() paginationDto: PaginationDto) {
    return this.cvService.filterCvWithPagination(filter, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto) {
    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
}
