import { Exclude } from "class-transformer";
import { CommonEntity } from "src/shared/entities/common.entiry";
import {
  Entity,
  Column,
  Unique,
  UpdateDateColumn,
  ObjectIdColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ObjectID
} from "typeorm";
import { TaskItemDTO } from "../dtos/task-item.dto";
@Entity('users')
export class UserEntity extends CommonEntity{

  @ObjectIdColumn()
  _id: ObjectID;

  // 昵称
  @Column("text")
  nickName: string;

  // 手机号
  @Column("text")
  phoneNumber: string;

  //密码
  @Column("text")
  password: string;

  // 头像
  @Column("text")
  avatar:string

  @Column({type: 'json', nullable: true})
  taskList:TaskItemDTO[]

  @Column({
    select:false
  })
  salt: string;
}
