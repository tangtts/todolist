import { TaskItemDTO } from "./../dtos/task-item.dto";
import { CreateUserDTO } from "./../dtos/create-user.dto";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import UserService from "../services/user.service";
import { LoginDTO } from "../dtos/login-user.dto";
import { AuthGuard } from "src/shared/guard/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadDTO } from "../dtos/upload.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { SearchUserDTO } from "../dtos/search-user.dto";
import { TaskService } from "../services/task.service";
import { TodoDTO } from "../dtos/todo.dto";

@ApiTags("任务模块")
@Controller("task")
export default class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({
    summary: "新增任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("add")
  add(@Req() req: any, @Body() task: TodoDTO) {
    return this.taskService.addTask(req.user.id,task);
  }

  @ApiOperation({
    summary: "选择任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("filter")
  filter(@Req() req: any, @Body() task: {taskId:string}) {
    return this.taskService.filterTask(task);
  }


  @ApiOperation({
    summary: "更新todo状态",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("complate")
  mark(@Req() req: any, @Body() task: {id:string,isComplated:boolean}) {
    return this.taskService.complate(task);
  }


}