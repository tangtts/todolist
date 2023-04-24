import { ArrowDownOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Dropdown, Input, MenuProps, message } from "antd"
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react"
import { fetchAddTask, fetchChangeTaskMarked, fetchFilterTask, fetchChangeTaskComplated, fetchComplatedTask, fetchMarkedTask, deleteOneTask } from "../../request/task"
import { ITaskItem } from "../../types"
import { TransitionGroup, CSSTransition } from "react-transition-group"


interface TaskItemContenxt {
  item: ITaskItem,
  changeMark: (item: ITaskItem) => void,
  changeComplateStatus: (item: ITaskItem) => void
  deleteOneTask: () => void,
}

const TaskItem: React.FC<
  TaskItemContenxt
> = ({ item, changeComplateStatus, changeMark, deleteOneTask: deleteOne }) => {

  const changeTaskItemStatus = (item: ITaskItem) => {
    changeComplateStatus(item)
  }

  const changeTaskItemMark = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ITaskItem) => {
    e.stopPropagation()
    changeMark(item)
  }
  const items: MenuProps['items'] = [
    {
      label: '删除',
      key: '1',
    },
  ];
  const handleMenuClick = () => {
    deleteOneTask({ id: item._id }).then(res => {
      if (res.code == 200) {
        deleteOne()
      }
    })
  }

  return (
    <>
      <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['contextMenu']}>
        <div
          className="flex items-center 
          hover:bg-white
            p-4 rounded-md 
            bg-[#eeeff3] 
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
      </Dropdown>
    </>
  )
}

export interface ContentType {
  taskId: number
  getInfo: () => void,
  chosenTxt: string
}


const Content: React.FC<ContentType> = ({ taskId, getInfo, chosenTxt }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [toDoData, setToDoData] = useState<ITaskItem[]>([])
  const [allTotal, setAllTotal] = useState(0)

  /**
   * @description 根据id获取对应的 task
   */
  const getFilterTask = () => {
    fetchFilterTask({ taskId: String(taskId) }).then(res => {
      if (res.code == 200) {
        setToDoData(res.data.unComplatedList)
        setDoneData(res.data.complatedList)
      }
    })
  }


  /**
   * @description 获取已经完成的任务
   */
  const getComplatedTask = () => {
    fetchComplatedTask().then(res => {
      if (res.code == 200) {
        setDoneData(res.data.tasks)
        setAllTotal(res.data.total)
      }
    });
  }



  useEffect(() => {
    getFilterTask()
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


  /**
   * @description 新增任务
   */
  const addTask = () => {
    if (!taskName.trim()) {
      return messageApi.open({
        type: 'warning',
        content: '请输入任务名称！',
      });
    }
    if (taskId) {
      fetchAddTask({
        taskName,
        taskId
      }).then(res => {
        if (res.code == 200) {
          // 更新任务列表的数量
          getInfo()
          // 获取最新的任务列表
          getFilterTask()
          setTaskName('')
        }
      })
    }
  }


  return (
    <>
      {contextHolder}
      <div className="bg-[#5f73c1] p-8 flex flex-col h-full rounded-md">
        <header className="text-white text-2xl">{chosenTxt}</header>
        <main>
          {/* todoData */}
          {
            toDoData.map(item => {
              return <TaskItem
                key={item._id}
                deleteOneTask={getFilterTask}
                changeMark={() => changeMark(item)}
                changeComplateStatus={() => changeComplateStatus(item)}
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
            <TransitionGroup>
              {!isFold &&
                doneData.map(item => {
                  return (
                    <CSSTransition
                      timeout={500}
                      classNames="toggleVisable"
                      key={item._id}>
                      <TaskItem
                        deleteOneTask={getFilterTask}
                        changeMark={() => changeMark(item)}
                        changeComplateStatus={() => changeComplateStatus(item)}
                        item={item} />
                    </CSSTransition>
                  )
                })
              }
            </TransitionGroup>
          </div>
        </main>
        <footer className="mt-auto">
          <Input size="large" value={taskName} onChange={(e) => setTaskName(e.target.value)}
            onPressEnter={addTask}></Input>
        </footer>
      </div>
    </>
  )
}

export default Content