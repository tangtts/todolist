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
} from "typeorm";

@Entity("taskDetails")
export class TaskEntity extends CommonEntity {

  //任务名称
  @Column("text")
  taskName: string;
  // 是否完成
  @Column("boolean")
  isComplated: boolean;

  // 是否被标记
  @Column("boolean")
  isMarked: boolean;

  //用户id
  @Column("text")
  userId: string;

  // 所属任务id
  @Column("text")
  taskId: string;
}
