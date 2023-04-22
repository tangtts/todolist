import { LoginParmas, LoginResponse,InfoResponse, TaskListResponse, UpdateParams } from './../types/index';
import  {UserUrl} from "./urls"
import {requset} from ".";

export function fetchLogin(data:LoginParmas){
  return requset<LoginResponse>({
    method:"POST",
    url:UserUrl.LoginUrl,
    data,
  })
}

export function fetchRegister(data){
  return requset<any>({
    method:"POST",
    url:UserUrl.RegisterUrl,
    data,
  })
}




export function fetchInfo(){
  return requset<InfoResponse>({
    url:UserUrl.InfoUrl,
  })
}

export function fetchAddTaskItem(data){
  return requset<TaskListResponse>({
    url:UserUrl.taskAddItemUrl,
    method:"Post",
    data
  })
}

export function fetchUpdateTaskItem(data){
  return requset<TaskListResponse>({
    url:UserUrl.taskUpdateItemUrl,
    method:"Post",
    data
  })
}

export function fetchSearchTaskItem(data){
  return requset<TaskListResponse>({
    url:UserUrl.taskSearchItemUrl,
    method:"Post",
    data
  })
}

export function fetchUpdateUser(data:UpdateParams){
  return requset<InfoResponse>({
    url:UserUrl.updateUrl,
    method:"Post",
    data
  })
}
