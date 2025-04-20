// src/cv/cv.controller.v2.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  Put,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';
import { FileUploadInterceptor } from '../Interceptors/file-upload.interceptor';


@Controller({ path: 'cv', version: '2' }) 
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}

  @Post("")
  async create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const userId = req['userId'];  // Get userId from the request object injected by AuthMiddleware
    createCvDto.user = { id: userId };  // Add the userId to the CV data
    return this.cvService.create(createCvDto);  // Call the service to create the CV
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCvDto: UpdateCvDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;

    const cv = await this.cvService.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV non trouvé');
    }

    if (cv.user.id !== userId) {
      throw new ForbiddenException('Non autorisé à modifier ce CV');
    }

    return this.cvService.update(id, updateCvDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    const userId = req.user.id;

    const cv = await this.cvService.findOne(id);
    if (!cv) {
      throw new NotFoundException('CV non trouvé');
    }

    if (cv.user.id !== userId) {
      throw new ForbiddenException('Non autorisé à supprimer ce CV');
    }

    return this.cvService.remove(id);
  }


  @Get()
  findAll() {
    return this.cvService.findAll(); // OK si renvoie un observable
  }

  @Post('upload/:id')
  @UseInterceptors(FileUploadInterceptor.imageInterceptor())  // Use custom interceptor
  async uploadCvImage(@UploadedFile() file: Express.Multer.File,@Body() body: { cvId: number }) {
    if (!file) {
      throw new BadRequestException('No valid image uploaded');
    }
    const path = file.path;
    const updatedCv = await this.cvService.addImageToCv(body.cvId, path);
    return {
      message: 'Image uploaded successfully',
      cv:updatedCv,
    };
  }
}
