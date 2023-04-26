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
    return this.taskService.addTask(req.user.id, task);
  }

  @ApiOperation({
    summary: "选择任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("filter")
  filter(@Req() req: any, @Body() task: { taskId: string }) {
    return this.taskService.filterTask(task);
  }

  @ApiOperation({
    summary: "切换todo是否完成",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("toggleComplate")
  toggleComplate(
    @Req() req: any,
    @Body() task: { id: string; isComplated: boolean }
  ) {
    return this.taskService.toggleComplate(req.user.id,task);
  }

  @ApiOperation({
    summary: "任务添加标记",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("mark")
  mark(@Req() req: any, @Body() task: { id: string; isMarked: boolean }) {
    return this.taskService.mark(task);
  }

  @ApiOperation({
    summary: "获取已经完成的所有任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Get("getAllComplated")
  getAllComplated(@Req() req: any) {
    return this.taskService.getAllComplated(req.user.id);
  }

  @ApiOperation({
    summary: "获取已经标记的任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Get("getAllMarked")
  getAllMarked(@Req() req: any) {
    return this.taskService.getAllMarked(req.user.id);
  }

  @ApiOperation({
    summary: "删除某一项任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("deleteOneTask")
  deleteOneTask(@Req() req: any,@Body() {id}) {
    return this.taskService.deleteOneTask(req.user.id,id);
  }

  @ApiOperation({
    summary: "删除某一组任务",
  })
  @ApiBearerAuth("JWT")
  @UseGuards(AuthGuard)
  @Post("deleteTaskList")
  deleteTaskList(@Req() req: any,@Body() {id}) {
    return this.taskService.deleteTaskList(req.user.id,id);
  }



}
