import { Column, CreateDateColumn, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm"

export class CommonEntity {

  @ObjectIdColumn()
  _id: ObjectID;

  @CreateDateColumn()
  createAt:Date

  @UpdateDateColumn()
  updateAt:Date

  @Column({
    default:false,
    select:false
  })
  isDelete:boolean
}