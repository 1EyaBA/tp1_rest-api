import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;   
  
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
    app.useStaticAssets(join(__dirname, '..', 'public', 'uploads'), {
    prefix: '/uploads/',
  });
// Set the port to use
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
