import {AxiosInstance} from "."
export namespace UserUrl {

  export const LoginUrl = 'user/login'
  export const RegisterUrl = 'user/register'
  export const InfoUrl = 'user/info'
  export const taskAddItemUrl = 'user/addTaskItem'
  export const taskUpdateItemUrl = 'user/updateTaskItem'
  export const taskSearchItemUrl = 'user/searchTaskItem'
  export const uploadUrl =  AxiosInstance.defaults.baseURL + '/user/upload'
  export const updateUrl =  'user/update'
  
  
} 
export namespace TaskUrl{
  export const addTaskUrl =  'task/add'
  export const filterTaskUrl =  'task/filter'
  export const changeTaskMarkedUrl =  'task/mark'
  export const changeTaskComplatedUrl =  'task/toggleComplate'
  export const getComplatedUrl =  'task/getAllComplated'
  export const getAllMarkedUrl =  'task/getAllMarked'
  
}