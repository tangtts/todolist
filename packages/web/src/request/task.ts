import { requset } from ".";
import { TaskUrl } from "./urls";


export function fetchAddTask(data:any){
  return requset<any>({
    url:TaskUrl.addTaskUrl,
    method:"Post",
    data
  })
}

export function fetchFilterTask(data:any){
  return requset<any>({
    url:TaskUrl.filterTaskUrl,
    method:"Post",
    data
  })
}

export function fetchChangeTaskMarked(data:any){
  return requset<any>({
    url:TaskUrl.changeTaskMarkedUrl,
    method:"Post",
    data
  })
}

export function fetchChangeTaskComplated(data:any){
  return requset<any>({
    url:TaskUrl.changeTaskComplatedUrl,
    method:"Post",
    data
  })
}

