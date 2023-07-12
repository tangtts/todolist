import { SearchUserDTO } from "./../dtos/search-user.dto";
import { UpdateUserDTO } from "./../dtos/update-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateUserDTO } from "./../dtos/create-user.dto";
import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { getRepository, Like, MongoRepository, ObjectID } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { encrytPassword, makeSalt } from "src/shared/utils/cryptogram.util";
import { LoginDTO } from "../dtos/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UploadService } from "src/shared/upload/upload.service";
import { deleteProperty } from "src/shared/utils/deleteNoUserdProperty";
import { TaskItemDTO } from "../dtos/task-item.dto";
import { TaskEntity } from "../entities/task.entity";
import { TaskListEntity } from "../entities/taskList.entity";
@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: MongoRepository<TaskEntity>,

    @InjectRepository(TaskListEntity)
    private readonly taskListRepository: MongoRepository<TaskListEntity>,
    
    private readonly jwtService: JwtService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * @description 注册接口
   * @async
   * @param {CreateUserDTO} user
   * @returns {Promise<UserEntity>}
   */
  @UseInterceptors(ClassSerializerInterceptor)
  async register(user: CreateUserDTO) {
    const isExitUser = await this.userRepository.findOneBy({
      phoneNumber: user.phoneNumber,
    });

    if (isExitUser) {
      throw new UnauthorizedException("用户已存在");
    }

    // 创建 加密后的密码
    const { salt, hashPassword } = this.getPassword(user.password);
    let u = new UserEntity();
    u.salt = salt;
    u.password = hashPassword;
    u.phoneNumber = user.phoneNumber;
    u.nickName = user.nickName;
    return await this.userRepository.save(u);
  }

  /**
   * @description 登录接口
   * @async
   * @param {LoginDTO} login
   * @returns {Promise<Object>} {data:{token}}
   */
  async login(login: LoginDTO) {
    const user = await this.checkLoginForm(login);
    // 生成token
    const token = await this.certificate(user);
    return {
      token,
    };
  }

  /**
   *
   * @description 根据id获取用户信息
   * @async
   * @param {string} id - 用户 ID
   * @return {{Promise<UserEntity>}} 用户信息
   */
  async info(userId: string) {
    //始终为 1
    let r = null;
    try {
      r = await this.userRepository.findOneByOrFail({ userId });
    } catch (error) {
      new NotFoundException("用户不存在！");
    }
    return r;
  }

  /**
   *
   * @description 根据id更新用户信息
   * @async
   * @param {string} id - 用户 ID
   * @param {UpdateUserDTO} user - 传入的用户信息
   * @return {{Promise<UserEntity>}} 更新之后的用户信息
   */
  async update(userId: string, updateUserDTO: UpdateUserDTO) {
    let findUser = await this.findOneBy({ userId });
    if (!findUser) {
      return new NotFoundException("用户不存在！");
    }
    delete updateUserDTO.password_confirmed;
    const result = await this.userRepository.update(userId, updateUserDTO);
    return result.affected;
  }

  /**
   *
   * @description 添加侧边栏任务
   * @param {string} id
   * @param {TaskItemDTO} todoItem
   * @memberof UserService
   */
  async addTaskItem(userId: number, todoItem: TaskItemDTO) {

    const findUser = await this.userRepository.findOne({
      where:{userId},
      relations:["taskList"]
    });
  
    if (!findUser) {
      throw new NotFoundException("用户不存在！");
    }
  
    const taskListEntity = new TaskListEntity();
    taskListEntity.taskName = todoItem.txt;
    taskListEntity.userId = findUser.userId;

    if (findUser.taskList) {
      findUser.taskList.push(taskListEntity);
    } else {
      findUser.taskList = [taskListEntity];
    }
    return await this.userRepository.save(findUser);
  }
  

  /**
   *
   * @description 修改侧边栏任务
   * @param {string} id
   * @param {TaskItemDTO} todoItem
   * @memberof UserService
   */
  //  TaskItemDTO & {itemId:number}
  async updateTaskItem(userId: number, todoItem:TaskItemDTO ) {
    const findUser = await this.userRepository.findOne({
      where:{userId},
      relations:["taskList"]
    });
  
    if (!findUser) {
      throw new NotFoundException("用户不存在！");
    }
  
    // 先找到对应的todoItem 的某一项
     findUser.taskList.forEach(task=>{
      if(task.taskId == todoItem.taskId){
        task.taskName = todoItem.txt;
      }
    })
    return await this.userRepository.save(findUser);
  }

  async searchTask(userId: number, searchUserDTO: SearchUserDTO) {
   let taskList =  await this.taskListRepository.find({
      where:{
        userId,
        taskName:Like(`%${searchUserDTO.taskName}%`)
      }
    })
    return taskList;
  }

  /**
   *
   *
   * @param {object} params
   * @return {*}
   * @memberof UserService
   */
  async findOneBy(params: Record<string, unknown>) {
    return this.userRepository.findOneBy(params);
  }

  /**
   *
   * @description 上传图片，返回本地图片链接
   * @param {*} file
   * @return {object} {data:图片url}
   * @memberof UserService
   */
  async uploadAvatar(file) {
    const { url } = await this.uploadService.upload(file);
    return { path: "http://localhost:3000" + url };
  }

  /**
   *
   *
   * @description 生成token
   * @param {UserEntity} user
   * @return {*}
   * @memberof UserService
   */

  private async certificate(user: UserEntity) {
    const payload = {
      id: user.userId,
    };
    const token = this.jwtService.signAsync(payload);
    return token;
  }
  /**
   *
   * @description 校验用户信息
   * @param {LoginDTO} LoginDto
   * @return {Object} user
   * @memberof UserService
   */
  private async checkLoginForm(LoginDto: LoginDTO) {
    const { phoneNumber, password } = LoginDto;

    const user = await this.userRepository.findOneBy({
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    const { password: dbPassword, salt } = user;
    const currentHashPassword = encrytPassword(password, salt);

    if (dbPassword !== currentHashPassword) {
      // 401
      throw new UnauthorizedException("认证失败");
    }
    return user;
  }

  /**
   *
   *
   * @private
   * @param {*} password
   * @return {Object} { salt password}
   * @memberof UserService
   */
  private getPassword(password) {
    const salt = makeSalt();
    const hashPassword = encrytPassword(password, salt);
    return { salt, hashPassword };
  }
}
