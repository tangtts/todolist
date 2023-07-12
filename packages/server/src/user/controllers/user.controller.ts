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
  Query,
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


import * as multer from "multer";
import * as fs from 'fs';
import * as path from "path";
import { log } from "console";
import { join } from "path";
@ApiTags("用户模块")
@Controller("user")
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: "用户注册",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateUserDTO,
  })
  @Post("register")
  register(@Body() user: CreateUserDTO) {
    return this.userService.register(user);
  }

  @ApiOperation({
    summary: "用户登录",
  })
  @Post("login")
  login(@Body() login: LoginDTO) {
    return this.userService.login(login);
  }

  @ApiBearerAuth("JWT")
  @ApiOperation({
    summary: "用户信息",
  })
  @Get("info")
  @UseGuards(AuthGuard)
  info(@Req() req: any) {
    const token = req.user.id;
    return this.userService.info(token);
  }

  /**
   *
   * @description 更新用户
   * @param {*} req
   * @param {UpdateUserDTO} updateUserDTO
   * @return {*}
   * @memberof UserController
   */
  @ApiBearerAuth("JWT")
  @ApiOperation({
    summary: "更新用户",
  })
  @Post("update")
  @UseGuards(AuthGuard)
  update(@Request() req, @Body() updateUserDTO: UpdateUserDTO) {
    const token = req.user.id;
    return this.userService.update(token, updateUserDTO);
  }

  /**
   *
   * @description 添加任务列表
   * @param {*} req
   * @param {TaskItemDTO} updateUserDTO
   * @return {*}
   * @memberof UserController
   */
  @ApiBearerAuth("JWT")
  @ApiOperation({
    summary: "添加任务列表",
  })
  @Post("addTaskItem")
  @UseGuards(AuthGuard)
  addTaskItem(@Request() req, @Body() updateUserDTO: TaskItemDTO) {
    const token = req.user.id;
    return this.userService.addTaskItem(token, updateUserDTO);
  }

  /**
   *
   * @desription 修改任务列表
   * @param {*} req
   * @param {TaskItemDTO} updateUserDTO
   * @return {*}
   * @memberof UserController
   */
  @ApiBearerAuth("JWT")
  @ApiOperation({
    summary: "修改任务列表",
  })
  @Post("updateTaskItem")
  @UseGuards(AuthGuard)
  updateTaskItem(@Request() req, @Body() updateUserDTO: TaskItemDTO) {
    const token = req.user.id;
    return this.userService.updateTaskItem(token, updateUserDTO);
  }

  /**
   *
   * @desription 修改任务列表
   * @param {*} req
   * @param {TaskItemDTO} updateUserDTO
   * @return {*}
   * @memberof UserController
   */
  @ApiBearerAuth("JWT")
  @ApiOperation({
    summary: "获取任务列表",
  })
  @Post("searchTaskItem")
  @UseGuards(AuthGuard)
  searchTaskItem(@Request() req, @Body() searchUserDTO: SearchUserDTO) {
    const token = req.user.id;
    return this.userService.searchTask(token, searchUserDTO);
  }

  @ApiOperation({
    summary: "上传头像",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file",)
  )
  @Post("upload")
  async upload(
    @Req() req: UploadDTO,
    @Body() uploadDTO: UploadDTO,
    @UploadedFile() file
  ) {
  //   const a = path.join("")
  // let r =  path.join(process.cwd(), "my-uploads") + req.file.filename
  // console.log(r)
  //   return req.file
    // console.log(req.file,"fa",uploadDTO.name)
    return await this.userService.uploadAvatar(file);
  }
}
