import { TaskService } from './services/task.service';
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserController from "./controllers/user.controller";
import { UserEntity } from "./entities/user.entity";
import UserService from "./services/user.service";
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret,jwtSignOptions } from "src/constants";
import { UploadService } from "src/shared/upload/upload.service";
import TaskController from "./controllers/task.controller";
import { TaskEntity } from './entities/task.entity';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity,TaskEntity]),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions:jwtSignOptions,
    })
  ],
  controllers: [UserController,TaskController],
  providers:[UserService,UploadService,TaskService],
})
export class UserModule {}