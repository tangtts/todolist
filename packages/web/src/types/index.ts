export interface LoginParmas {
  phoneNumber:string
  password:string
}

interface CommonResponse<T = unknown>  {
  code:number
  data:T
}

export type LoginResponse = CommonResponse<{token:string}>
export type InfoResponse = CommonResponse<{
  nickName:string,
  avatar:string,
  phoneNumber:string
}>
