import { TodoDTO } from "./todo.dto";
import { IntersectionType, PartialType, PickType } from "@nestjs/mapped-types";

import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { Exclude, Transform } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
} from "class-validator";
import { IsConfirmed } from "src/shared/rules/isSamePassword.rule";
export class UpdateTodoDTO extends IntersectionType(
  PartialType(OmitType(TodoDTO, ["taskId"] as const)),
  PickType(TodoDTO, ["taskId"]  as const)
) {}
