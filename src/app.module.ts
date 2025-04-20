import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { Skill } from './skill/entities/skill.entity';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth/auth.middleware'; // Adjust the path as necessary
import { CvControllerV2 } from './cv/cv.controller.v2';
@Module({
  imports: [CvModule, UserModule, SkillModule,
    TypeOrmModule.forRoot({
      type: 'postgres',  // or 'mysql', depending on your DB
      host: 'localhost',
      port: 5432,        // Default port for PostgreSQL
      username: 'postgres',
      password: 'CMeky38308',
      database: 'TP1',
      entities: [User,Cv,Skill],  // Add all your entities here
      synchronize: true,  // In production, set this to false and handle migrations manually
    }),
    UserModule,
    CvModule,
    SkillModule,
  ],
  
  controllers: [AppController],
  providers: [AppService, AuthMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(CvControllerV2); // Middleware appliqué seulement à la version 2 du contrôleur CV
  }
}
