import {BadRequestException, Injectable} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Injectable()
export class FileUploadInterceptor{
  static imageInterceptor(){
    return FileInterceptor('image',{
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req,file,cb) => {
          const uniqueSuffix=Date.now() + '-'+ Math.round(Math.random()*1e9);
          const ext= extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req,file,cb) => {
        if(!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)){
          return cb(new BadRequestException('Only .jpg, .jpeg, and .png files are allowed'),false);
        }
        cb(null,true);
      },
      limits:{
        fileSize:1*1024*1024,
      },

    });
  }
}