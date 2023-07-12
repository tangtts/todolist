import { Column, CreateDateColumn, ObjectID, ObjectIdColumn, UpdateDateColumn } from "typeorm"

export abstract  class CommonEntity {
  @CreateDateColumn({
    comment:"创建时间"
  })
  createAt:Date

  @UpdateDateColumn({
    comment:"更新时间"
  })
  updateAt:Date

  @Column({
    default:false,
    select:false
  })
  isDelete:boolean
}