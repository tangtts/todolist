import { requset } from ".";
import { FilterTaskResponse, ITaskItem } from "../types";
import { TaskUrl } from "./urls";


export function fetchAddTask(data:any){
  return requset<FilterTaskResponse>({
    url:TaskUrl.addTaskUrl,
    method:"Post",
    data
  })
}

export function fetchFilterTask(data:{taskId:string}){
  return requset<FilterTaskResponse>({
    url:TaskUrl.filterTaskUrl,
    method:"Post",
    data
  })
}

export function fetchChangeTaskMarked(data:{id:number,isMarked:boolean}){
  return requset<any>({
    url:TaskUrl.changeTaskMarkedUrl,
    method:"Post",
    data
  })
}

export function fetchChangeTaskComplated(data:{id:number,isComplated:boolean}){
  return requset<FilterTaskResponse>({
    url:TaskUrl.changeTaskComplatedUrl,
    method:"Post",
    data
  })
}

export function fetchComplatedTask(){
  return requset<any>({
    url:TaskUrl.getComplatedUrl
  })
}

export function fetchMarkedTask(){
  return requset<any>({
    url:TaskUrl.getComplatedUrl
  })
}

export function deleteOneTask(data){
  return requset<any>({
    url:TaskUrl.deleteOneTaskUrl,
    method:"Post",
    data
  })
}


export function deleteTaskList(data){
  return requset<any>({
    url:TaskUrl.deleteTaskListUrl,
    method:"Post",
    data
  })
}

  


