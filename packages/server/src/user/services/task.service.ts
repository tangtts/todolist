import { TaskEntity } from "./../entities/task.entity";
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getMongoRepository, MongoRepository } from "typeorm";
import { TodoDTO } from "../dtos/todo.dto";
import { UserEntity } from "../entities/user.entity";
import { ObjectId } from "mongodb";
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,

    @InjectRepository(TaskEntity)
    private readonly taskRepository: MongoRepository<TaskEntity>
  ) {}

  async addTask(id: string, task: TodoDTO) {
    let t = new TaskEntity();
    t.isComplated = false;
    t.isMarked = false;
    t.taskName = task.taskName;
    t.taskId = task.taskId;
    t.userId = id;
    let r = await this.taskRepository.save(t);
    return;
  }

  async filterTask(task: { taskId: string }) {
    const taskList = await this.taskRepository.findBy({
      taskId: Number(task.taskId),
    });
    const complatedList: TodoDTO[] = [];
    const unComplatedList: TodoDTO[] = [];
    taskList.forEach(task => {
      if (task.isComplated) {
        complatedList.push(task);
      } else {
        unComplatedList.push(task);
      }
    });
    return {
      complatedList,
      unComplatedList,
    };
  }

  /**
   *
   * @description 切换是否完成
   * @param {{ id: string; isComplated: boolean }} { id, isComplated }
   * @return {*}
   * @memberof TaskService
   */
  async toggleComplate({
    id,
    isComplated,
  }: {
    id: string;
    isComplated: boolean;
  }) {
    let r = await this.taskRepository.update(
      { _id: ObjectId(id) },
      { isComplated }
    );
    return r.affected;
  }

  /**
   *
   * @description 标记
   * @param {{ id: string; isMarked: boolean }} { id, isMarked }
   * @return {*}
   * @memberof TaskService
   */
  async mark({ id, isMarked }: { id: string; isMarked: boolean }) {
    let r = await this.taskRepository.update(
      { _id: ObjectId(id) },
      { isMarked }
    );
    return r.affected;
  }

  /**
   *
   * @description 获取已经完成的
   * @param {string} userId
   * @return {*}
   * @memberof TaskService
   */
  async getAllComplated(userId: string) {
    let [tasks, count] = await this.taskRepository.findAndCountBy({
      where: {
        userId,
        isComplated: true,
      },
    });
    return {
      tasks,
      total: count,
    };
  }

  /**
   *
   * @description 获取被标记的
   * @param {string} userId
   * @return {*}
   * @memberof TaskService
   */
  async getAllMarked(userId: string) {
    let [tasks, count] = await this.taskRepository.findAndCountBy({
      where: {
        userId,
        isMarked: true,
      },
    });
    return {
      tasks,
      total: count,
    };
  }
}
