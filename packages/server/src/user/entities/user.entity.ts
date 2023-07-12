import { TaskEntity } from './task.entity';
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
  ObjectID,
  OneToMany
} from "typeorm";
import { TaskItemDTO } from "../dtos/task-item.dto";
import { TaskListEntity } from "./taskList.entity";


@Entity('users')
export class UserEntity extends CommonEntity{

  @PrimaryGeneratedColumn()
  userId: number;

  // 昵称
  @Column("text")
  nickName: string;

  // 手机号
  @Column({
    type:"varchar",
    length: 150,
    unique: true,
  })
  phoneNumber: string;

  //密码
  @Column({
   type:"text"
  })
  password: string;

  // 头像
  @Column({
    type:"varchar",
    default:""
  })
  avatar:string

  @JoinTable()
  @OneToMany(()=>TaskListEntity,(task)=>task.user,{
    // 会同步到taskList 中
    cascade:true
  })
  taskList:TaskListEntity[]

  @OneToMany(()=>TaskEntity,(task)=>task.userId,{
    cascade:true
  })
 taskItemId:TaskEntity

  @Column({
    comment:"完成数量",
    default:0
  })
  complatedCount:number

  @Column({
    comment:"标记数量",
    default:0
  })
  markedCount:number

  @Column({
    // select:false
  })
  salt: string;
}
