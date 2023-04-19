import { LoginParmas, LoginResponse,InfoResponse } from './../types/index';
import  {UserUrl} from "./urls"
import {requset} from ".";

export function fetchLogin(data:LoginParmas){
  return requset<LoginResponse>({
    method:"POST",
    url:UserUrl.LoginUrl,
    data,
  })
}

export function fetchInfo(){
  return requset<InfoResponse>({
    url:UserUrl.InfoUrl,
  })
}