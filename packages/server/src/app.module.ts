import { Module } from '@nestjs/common';
import {UserModule} from './user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DataSourceOptions } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { TaskEntity } from './user/entities/task.entity';
import { TaskListEntity } from './user/entities/taskList.entity';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "todo",
      entities: [UserEntity,TaskEntity,TaskListEntity],
      synchronize: true,
    }),
  ], 
  
  controllers: [],
  providers: [], 
})
export class AppModule {}