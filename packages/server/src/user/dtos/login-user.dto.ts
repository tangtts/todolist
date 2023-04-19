

import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches, Validate} from "class-validator"
import { IsConfirmed } from "src/shared/rules/isSamePassword.rule";
export class LoginDTO {

  @ApiProperty({example:"18623816694"})
  @IsPhoneNumber("CN")
  phoneNumber:string;

  @ApiProperty({example:"123456"})
  @Length(3,6)
  password:string

}