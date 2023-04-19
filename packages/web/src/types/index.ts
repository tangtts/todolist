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
  phoneNumber:string,
  taskList:Omit<ISideItem,'updateItemTxt' | 'id'>[]
}>

export type TaskListResponse = CommonResponse<Array< Omit<ISideItem,'updateItemTxt' | 'id'>>
>


export interface ISideItem {
  icon?: React.ReactNode,
  txt?: string,
  num?: number | string
  id?:number | string
  updateItemTxt?:(id:ISideItem['id'],todo:ISideItem['txt'])=>void
}