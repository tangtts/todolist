

import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import { IsBoolean, IsDateString, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, Matches, Validate} from "class-validator"
import { IsConfirmed } from "src/shared/rules/isSamePassword.rule";
export class TodoDTO {
  @ApiProperty({example:false})
  @IsBoolean()
  isComplated:boolean =  false

  @ApiProperty({example:false})
  @IsBoolean()
  isMarked:boolean = false

  @ApiProperty({example:"0"})
  @IsString()
  @Transform((value)=>String(value))
  taskId:string

  @ApiProperty({example:"吃喝玩乐"})
  @IsString()
  taskName:string

}