import { SearchUserDTO } from "./../dtos/search-user.dto";
import { UpdateUserDTO } from "./../dtos/update-user.dto";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateUserDTO } from "./../dtos/create-user.dto";
import { ObjectId } from "mongodb";
import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { encrytPassword, makeSalt } from "src/shared/utils/cryptogram.util";
import { LoginDTO } from "../dtos/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UploadService } from "src/shared/upload/upload.service";
import { deleteProperty } from "src/shared/utils/deleteNoUserdProperty";
import { TaskItemDTO } from "../dtos/task-item.dto";
import { TaskEntity } from "../entities/task.entity";
@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: MongoRepository<TaskEntity>,
    private readonly jwtService: JwtService,
    private readonly uploadService: UploadService
  ) {}

  /**
   * @description 注册接口
   * @async
   * @param {CreateUserDTO} user
   * @returns {Promise<UserEntity>}
   */
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
    u.avatar = user.avatar;
    u.taskList = [];
    u.nickName = user.nickName;
    return this.userRepository.save(u);
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
  async info(id: string) {
    if (!(await this.findOneBy({ _id: ObjectId(id) }))) {
      return new NotFoundException("用户不存在！");
    }
    const user = await this.userRepository.findOneBy(id);

    //始终为 1
    //   const pipeline = [
    //     { $match: { _id: user._id } },
    //     { $unwind: '$taskList' },
    //     { $lookup: { from: 'task', localField: 'taskList.id', foreignField: '_id', as: 'task' } },
    //     { $addFields: { complatedCount: { $sum: { $cond: ['$task.isComplated', 1, 0] } } } },
    //     { $group: {
    //       _id: '$_id',
    //       complatedCount: { $first: '$complatedCount' },
    //       taskList: { $push: '$taskList' },
    //       nickName:{ $first: '$nickName' },
    //       password:{ $first: '$password' },
    //       avatar:{ $first: '$avatar' },
    //       phoneNumber:{$first: '$phoneNumber'}
    //      }}
    //   ];
    //  let [result] =  await this.userRepository.aggregate(pipeline).toArray();
    // const pipeline = [
    //   {
    //     $lookup: {
    //       from: "taskDetails",
    //       localField: "taskList.id",
    //       foreignField: "taskId",
    //       as: "tasks"
    //     }
    //   },
    //   {
    //     $unwind: "$tasks"
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       isComplated: "$tasks.isComplated",
    //       nickName: '$users.nickName'
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       complateCount: { $sum: { $cond: [ "$isComplated", 1, 0 ] } },
    //       complatedCount: { $first: '$complatedCount' },
    //       taskList: { $push: '$taskList' },
    //       nickName:{ $first: '$users.nickName' },
    //       password:{ $first: '$password' },
    //       avatar:{ $first: '$avatar' },
    //       phoneNumber:{$first: '$phoneNumber'}
    //     }
    //   }
    // ]
    // let [result] =  await this.userRepository.aggregate(pipeline).toArray();
    // console.log("🚀 ~ file: user.service.ts:129 ~ UserService ~ info ~ result:", result);
    return user;
  }

  /**
   *
   * @description 根据id更新用户信息
   * @async
   * @param {string} id - 用户 ID
   * @param {UpdateUserDTO} user - 传入的用户信息
   * @return {{Promise<UserEntity>}} 更新之后的用户信息
   */
  async update(id: string, user: UpdateUserDTO) {
    let findUser = await this.findOneBy({ _id: ObjectId(id) });
    if (!findUser) {
      return new NotFoundException("用户不存在！");
    }
    // 说明要改密码
    if (user.oldPassword) {
      // 判断老密码是否正确
      const oldEncrytPassword = encrytPassword(user.oldPassword, findUser.salt);

      if (findUser.password !== oldEncrytPassword) {
        throw new UnauthorizedException("认证失败");
      }
      const { salt, hashPassword } = this.getPassword(user.newPassword);
      findUser.salt = salt;
      findUser.password = hashPassword;
    }
    Object.entries(user).forEach(([k, v]) => {
      if (v) {
        findUser[k] = v;
      }
    });
    const result = await this.userRepository.update(id, findUser);
    return result.affected;
  }

  /**
   *
   * @description 添加侧边栏任务
   * @param {string} id
   * @param {TaskItemDTO} todoItem
   * @memberof UserService
   */
  async addTaskItem(id: string, todoItem: TaskItemDTO) {
    deleteProperty(["id"], todoItem);
    let findUser = await this.findOneBy({ _id: ObjectId(id) });
    // 产生唯一id
    todoItem.id = Date.now();
    findUser.taskList.push(todoItem);
    await this.update(id, findUser);
    return todoItem;
  }

  /**
   *
   * @description 修改侧边栏任务
   * @param {string} id
   * @param {TaskItemDTO} todoItem
   * @memberof UserService
   */
  async updateTaskItem(id: string, todoItem: TaskItemDTO) {
    let findUser = await this.findOneBy({ _id: ObjectId(id) });
    findUser.taskList = findUser.taskList.map(task => {
      if (task.id == todoItem.id) {
        return {
          ...task,
          ...todoItem,
        };
      } else {
        return task;
      }
    });

    await this.userRepository.update(id, findUser);

    return findUser.taskList;
  }

  async searchTask(id: string, searchUserDTO: SearchUserDTO) {
    let findUser = await this.findOneBy({ _id: ObjectId(id) });
    return findUser.taskList.filter(task => {
      return new RegExp(searchUserDTO.taskName).test(task.txt);
    });
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
      id: user._id,
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
