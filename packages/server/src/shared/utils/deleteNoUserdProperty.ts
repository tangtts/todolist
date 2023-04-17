
 export function deleteProperty<T extends  object>(parmas:Array<keyof T>,data:T){
  parmas.forEach(
    k => Reflect.deleteProperty(data, k)
  )
}
 