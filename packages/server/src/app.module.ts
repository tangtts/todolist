import { Module } from '@nestjs/common';
import {UserModule} from './user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: "mongodb://localhost/todolist",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    })
    ,UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
