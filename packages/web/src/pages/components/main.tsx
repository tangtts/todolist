import { ArrowDownOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Input } from "antd"
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react"
import { fetchAddTask, fetchChangeTaskMarked, fetchFilterTask, fetchChangeTaskComplated, fetchComplatedTask, fetchMarkedTask } from "../../request/task"
import { ITaskItem } from "../../types"

type ActionType = 'todo' | 'done'
type ChangeMark = (item: ITaskItem) => void;
type ChangeStatus = (item: ITaskItem) => void;

const TaskItem: React.FC<{
  item: ITaskItem,
  changeMark: ChangeMark,
  changeComplateStatus: ChangeStatus,
  type: ActionType
}> = ({ item, changeComplateStatus, changeMark, type }) => {

  const changeTaskItemStatus = (item: ITaskItem) => {
    changeComplateStatus(item)
  }

  const changeTaskItemMark = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ITaskItem) => {
    e.stopPropagation()
    changeMark(item)
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

export interface ContentType {
  getComplatedTask:()=>void,
  total:number
}


const Content = forwardRef(({ taskId }: {taskId:string | number}, ref: Ref<ContentType>) => {

  const [toDoData, setToDoData] = useState<ITaskItem[]>([])

  const getFilterTask = () => {
    fetchFilterTask({ taskId: String(taskId) }).then(res => {
      console.log(res, "res")
      if (res.code == 200) {
        setToDoData(res.data.unComplatedList)
        setDoneData(res.data.complatedList)
      }
    })
  }

  const [allTotal,setAllTotal] =  useState(0)

  const getComplatedTask = () => {
    fetchComplatedTask().then(res => {
      if (res.code == 200) {
        setDoneData(res.data.tasks)
        setAllTotal(res.data.total)
      }
    });
  }
  // 使用useImperativeHandle将方法暴露给父组件
  useImperativeHandle(ref, () => ({
    getComplatedTask,
    total:allTotal
  }));

  useEffect(() => {

    getFilterTask()

    fetchMarkedTask().then(res => {
      setDoneData(res.data.tasks)
    })

  }, [taskId])



  const [doneData, setDoneData] = useState<ITaskItem[]>([])
  const [isFold, setFold] = useState(false)


  const changeMark = (chosenItem: ITaskItem) => {
    fetchChangeTaskMarked({ id: chosenItem._id, isMarked: !chosenItem.isMarked }).then(res => {
      if (res.code == 200) {
        getFilterTask()
      }
    })
  }

  const changeComplateStatus = (chosenItem: ITaskItem) => {
    fetchChangeTaskComplated({ id: chosenItem._id, isComplated: !chosenItem.isComplated }).then(res => {
      if (res.code == 200) {
        getFilterTask()
      }
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
          getFilterTask()
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
              changeMark={() => changeMark(item)}
              changeComplateStatus={() => changeComplateStatus(item)}
              item={item} />
          })
        }
        {/* 中间的箭头 */}
        {allTotal}
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
                changeMark={() => changeMark(item)}
                changeComplateStatus={() => changeComplateStatus(item)}
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
})

export default Content