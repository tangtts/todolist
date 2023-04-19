

import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsDateString, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length, Matches, Validate} from "class-validator"
import { IsConfirmed } from "src/shared/rules/isSamePassword.rule";
export class TaskItemDTO {

  @IsNumber()
  @ApiHideProperty()
  id:string | number;

  @ApiProperty({example:"任务1"})
  @IsNotEmpty()
  txt:string

  @IsNumber()
  num:number

}