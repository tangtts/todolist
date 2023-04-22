import { ArrowDownOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Input } from "antd"
import React, { useEffect, useState } from "react"
import { fetchAddTask, fetchChangeTaskMarked, fetchFilterTask,fetchChangeTaskComplated } from "../../request/task"
import { ITaskItem } from "../../types"

type ActionType = 'todo' | 'done'
type ChangeMark = (type: ActionType, item: ITaskItem) => void;
type ChangeStatus = (type: ActionType, item: ITaskItem) => void;

const TaskItem: React.FC<{
  item: ITaskItem,
  changeMark: ChangeMark,
  changeStatus: ChangeStatus,
  type: ActionType
}> = ({ item, changeStatus, changeMark, type }) => {

  const changeTaskItemStatus = (item: ITaskItem) => {
    changeStatus(type, item)
  }
  const changeTaskItemMark = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ITaskItem) => {
    e.stopPropagation()
    changeMark(type, item)
  }

  return <div
    className="flex items-center 
  hover:bg-white
  p-4 rounded-md bg-[#eeeff3] 
  mt-2
  hover:cursor-pointer
  "
    onClick={() => changeTaskItemStatus(item)}
  >
    {/* 左边的圆球 */}
    <div >
      {
        item.isComplated ? <CheckCircleOutlined /> : <ClockCircleOutlined />
      }
    </div>
    <p className="ml-4">{item.taskName}</p>

    <div className="ml-auto" onClick={(e) => changeTaskItemMark(e, item)}>
      {
        item.isMarked ? <StarFilled /> : <StarOutlined />
      }
    </div>

  </div>
}

const Content: React.FC<{ taskId: string }> = ({ taskId }) => {

  const [toDoData, setToDoData] = useState<ITaskItem[]>([])

  useEffect(() => {
    fetchFilterTask({ taskId }).then(res => {
      console.log(res)
      if (res.code == 200) {
        setToDoData(res.data.data.unComplatedList)
        setDoneData(res.data.data.isComplatedList)
      }
    })
  }, [taskId])



  const [doneData, setDoneData] = useState<ITaskItem[]>([])
  const [isFold, setFold] = useState(false)


  function setDataAndAction(type: ActionType) {
    let temData: ITaskItem[] = [];
    let action: React.Dispatch<React.SetStateAction<ITaskItem[]>>;
    if (type == "todo") {
      temData = toDoData;
      action = setToDoData
    } else {
      temData = doneData
      action = setDoneData
    }
    return {
      type,
      temData,
      action
    }
  }


 

/**
 *
 * @description 根据 id 区分任务
 * @param {number} id
 * @param {ITaskItem[]} data
 * @return {*} 
 */
// function filterDataById(id: number, data: ITaskItem[]) {
//     let chosenData: ITaskItem[] = []
//     let filterData: ITaskItem[] = []
//     data.forEach(item => {
//       if (item._id == id) {
//         chosenData.push(item)
//       } else {
//         filterData.push(item)
//       }
//     })
//     return {
//       chosenData,
//       filterData
//     }
//   }

  function setStatus(type: ActionType, K: 'isMarked' | 'isComplated', chosenItem: ITaskItem) {
    // if (type == 'todo') {
    //   const { chosenData, filterData } = filterDataById(chosenItem._id, toDoData)
    //   setToDoData(filterData)
    //   setDoneData([...doneData, ...chosenData])
    // } else {
    //   const { chosenData, filterData } = filterDataById(chosenItem._id, doneData)
    //   setDoneData(filterData)
    //   setToDoData([...toDoData, ...chosenData])
    // }
  }


  const changeStatus = (type: ActionType, chosenItem: ITaskItem) => {
    setStatus(type, "isComplated", chosenItem)
  }

  const changeMark = (chosenItem: ITaskItem) => {
    fetchChangeTaskComplated({id:chosenItem._id,isComplated:!chosenItem.isComplated}).then(res=>{
      console.log(res)
    })
  }
  const [taskName, setTaskName] = useState('')

  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let taskName = ((e.target) as HTMLInputElement).value;
    if (taskId) {
      fetchAddTask({
        taskName,
        taskId
      }).then(res => {
        if (res.code == 200) {
          setTaskName('')
        }
      })
    }
  }




  return (
    <div className="bg-[#5f73c1] p-8 flex flex-col h-full rounded-md">
      <header className="text-white text-2xl">xxxx</header>
      <main>
        {/* todoData */}
        {
          toDoData.map(item => {
            return <TaskItem
              type="todo"
              key={item._id}
              changeMark={()=>changeMark(item)}
              changeStatus={changeStatus}
              item={item} />
          })
        }
        {/* 中间的箭头 */}
        <div className="mt-4">
          <div className="inline-flex px-4 py-1 rounded-md justify-between items-center  hover:cursor-pointer
          bg-[#d0d6ee]
          border-1
          border-gray-200
          hover:bg-white
          " onClick={() => setFold(!isFold)}>

            {
              isFold ? <ArrowRightOutlined className="text-xl" /> : <ArrowDownOutlined className="text-xl" />
            }
            <header className="
           ml-4">已完成({doneData.length})</header>
          </div>

          {
            doneData.map(item => {
              return <TaskItem
                type="done"
                key={item._id}
                changeMark={()=>changeMark(item)}
                changeStatus={changeStatus}
                item={item} />
            })
          }
        </div>


      </main>
      <footer className="mt-auto">
        <Input size="large" value={taskName} onChange={e => setTaskName(e.target.value)} onPressEnter={(e) => addTask(e)}></Input>

      </footer>
    </div>
  )
}

export default Content