import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query,
  UploadedFile, UseInterceptors, UseGuards, BadRequestException,
  ForbiddenException, NotFoundException
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileUploadInterceptor } from '../Interceptors/file-upload.interceptor';
import { User as userDecorator } from '../middleware/auth/user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../middleware/auth/roles.guard';
import { Role } from '../middleware/auth/role.decorator';

@UseGuards(RolesGuard)
@Controller({
  path: 'cv',
  version: '2',
})
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}

  @Post()
  async create(@Body() createCvDto: CreateCvDto, @userDecorator() user: User) {
    createCvDto.user = user;
    return this.cvService.create(createCvDto);
  }

  @Post('upload')
  @UseInterceptors(FileUploadInterceptor.imageInterceptor())
  async uploadCvImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { cvId: number },
    @userDecorator() user: User,
  ) {
    if (!file) {
      throw new BadRequestException('No valid image uploaded');
    }

    const cv = await this.cvService.findOneWithRelations(body.cvId, ['user']);


    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    if (user.role !== 'admin' && cv.user?.id !== user.id) {
      throw new ForbiddenException("You can't upload an image to this CV");
    }

    const updatedCv = await this.cvService.addImageToCv(body.cvId, file.path);
    return {
      message: 'Image uploaded successfully',
      cv: updatedCv,
    };
  }


  @Role('admin')
  @Get('getAll')
  findAllAdmin() {
    return this.cvService.findAll();
  }

  @Get()
  async findAllByUser(@userDecorator() user: User) {
    if (user.role === 'admin') {
      return this.cvService.findAll();
    }
    return this.cvService.findByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @userDecorator() user: User) {
    const cv = await this.cvService.findOneWithRelations(+id, ['user']);


    if (!cv || !cv[0]) throw new NotFoundException('CV not found');

    if (user.role !== 'admin' && cv[0].user?.id !== user.id) {
      throw new ForbiddenException("You can't access this CV");
    }

    return cv[0];
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @userDecorator() user: User,
  ) {
    const cv = await this.cvService.findOneWithRelations(+id, ['user']);


    if (!cv || !cv[0]) throw new NotFoundException('CV not found');

    if (user.role !== 'admin' && cv[0].user?.id !== user.id) {
      throw new ForbiddenException("You can't update this CV");
    }

    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @userDecorator() user: User) {
    const cv = await this.cvService.findOneWithRelations(+id, ['user']);


    if (!cv || !cv[0]) throw new NotFoundException('CV not found');

    if (user.role !== 'admin' && cv[0].user?.id !== user.id) {
      throw new ForbiddenException("You can't delete this CV");
    }

    return this.cvService.remove(+id);
  }
}
