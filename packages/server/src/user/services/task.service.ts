import { TaskEntity } from "./../entities/task.entity";
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
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
    let u = await this.userRepository.findOneBy({ _id: ObjectId(id) });
    u.taskList = u.taskList.map(item => {
      if (item.id == task.taskId) {
        return {
          ...item,
          num: item.num + 1,
        };
      } else {
        return item;
      }
    });
    await this.userRepository.update(id, { taskList: u.taskList });
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
  async toggleComplate(
    userId,
    {
      id,
      isComplated,
    }: {
      id: string;
      isComplated: boolean;
    }
  ) {
    let r = await this.taskRepository.update(
      { _id: ObjectId(id) },
      { isComplated }
    );
    let u = await this.userRepository.findOneBy({ _id: ObjectId(userId) });
    if (isComplated) {
      u.complatedCount = u.complatedCount + 1;
    } else {
      u.complatedCount = u.complatedCount - 1;
    }
    let r1 = await this.userRepository.update(
      { _id: ObjectId(userId) },
      { complatedCount: u.complatedCount }
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
  async toggleMark(userId,{ id, isMarked }: { id: string; isMarked: boolean }) {


    let u = await this.userRepository.findOneBy({ _id: ObjectId(userId) });
    if (isMarked) {
      u.markedCount = u.markedCount + 1;
    } else {
      u.markedCount = u.markedCount - 1;
    }
    let r1 = await this.userRepository.update(
      { _id: ObjectId(userId) },
      { markedCount: u.markedCount }
    );

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

  async deleteOneTask(userId: string, id: string) {
    // 先找到这个id，更新 user 表中的 数量
    // 然后才能删除
    const r = await this.taskRepository.findOneBy({ _id: ObjectId(id) });
    let u = await this.userRepository.findOneBy({ _id: ObjectId(userId) });
    r &&
      (u.taskList = u.taskList.map(item => {
        if (item.id == r.taskId) {
          return {
            ...item,
            num: item.num - 1,
          };
        } else {
          return item;
        }
      }));

    await this.userRepository.update(userId, {
      taskList: u.taskList,
      complatedCount:r.isComplated ? u.complatedCount - 1 :u.complatedCount ,
      markedCount:r.isMarked ?  u.markedCount-1 : u.markedCount 
    });
    await this.taskRepository.findOneAndDelete({ _id: ObjectId(id) });
    return;
  }

  async deleteTaskList(userId, taskId: string) {
    const r = await this.userRepository.findOneBy({ _id: ObjectId(userId) });
    r.taskList = r.taskList.filter(task => task.id != taskId);
    // 根据taskId 查询数量
    let t = await this.taskRepository.findAndCountBy({ taskId });
    let r1 = await this.userRepository.update(userId, {
      taskList: r.taskList,
      complatedCount: r.complatedCount - t.length,
      markedCount:r.markedCount - t.length
    });

    // taskId 同步删除
    let r2 = await this.taskRepository.deleteMany({ taskId });
    return;
  }
}
