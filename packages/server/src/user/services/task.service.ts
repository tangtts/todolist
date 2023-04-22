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
    let r = await this.taskRepository.save(t);
    return {
      ok: HttpStatus.OK,
    };
  }

  async filterTask(task: { taskId: string }) {
    const taskList = await this.taskRepository.findBy({ taskId: task.taskId });
    const isComplatedList: TodoDTO[] = [];
    const unComplatedList: TodoDTO[] = [];
    taskList.forEach(task => {
      if (task.isComplated) {
        isComplatedList.push(task);
      } else {
        unComplatedList.push(task);
      }
    });
    return {
      ok: HttpStatus.OK,
      data: {
        isComplatedList,
        unComplatedList,
      },
    };
  }
  async complate({ id, isComplated }: { id: string; isComplated: boolean }) {
    const task = await this.taskRepository.findOneBy({ _id: ObjectId(id) });
    let r = await this.taskRepository.update(
      { _id: ObjectId(id) },
      { isComplated }
    );

    const taskList = await this.taskRepository.findBy({ taskId: task.taskId });

    return {
      ok: HttpStatus.OK,
      data: {
        taskList,
      },
    };
  }
}
