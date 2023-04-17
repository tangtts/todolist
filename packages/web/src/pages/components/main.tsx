import { ArrowDownOutlined, ArrowRightOutlined, CheckCircleOutlined, ClockCircleOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Input } from "antd"
import React, { useState } from "react"

interface IData {
  id: number
  txt: string,
  isComplated: boolean,
  isMarked: boolean,
}


type ActionType = 'todo' | 'done'
type ChangeMark = (type: ActionType, item: IData) => void;
type ChangeStatus = (type: ActionType, item: IData) => void;

const TaskItem: React.FC<{
  item: IData,
  changeMark: ChangeMark,
  changeStatus: ChangeStatus,
  type: ActionType
}> = ({ item, changeStatus, changeMark, type }) => {

  const changeTaskItemStatus = (item: IData) => {
    changeStatus(type, item)
  }
  const changeTaskItemMark = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: IData) => {
    e.stopPropagation()
    changeMark(type, item)
  }

  return <div
    className="flex items-center 
        hover:bg-yellow-100
        p-4 rounded-sm bg-gray-100 mt-2
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
    <p className="ml-4">{item.txt}</p>

    <div className="ml-auto" onClick={(e) => changeTaskItemMark(e, item)}>
      {
        item.isMarked ? <StarFilled /> : <StarOutlined />
      }
    </div>

  </div>
}

const Content = () => {

  const [toDoData, setToDoData] = useState<IData[]>([
    {
      id: 0,
      txt: "aaaa",
      isComplated: false,
      isMarked: false
    }, {
      id: 1,
      txt: "bbbb",
      isComplated: false,
      isMarked: true
    }
  ])


  const [doneData, setDoneData] = useState<IData[]>([
    {
      id: 2,
      txt: "aaaa",
      isComplated: true,
      isMarked: false
    }, {
      id: 3,
      txt: "bbbb",
      isComplated: true,
      isMarked: true
    }
  ])
  const [isFold, setFold] = useState(false)


  function setDataAndAction(type: ActionType) {
    let temData: IData[] = [];
    let action: React.Dispatch<React.SetStateAction<IData[]>>;
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


  function setMark(type: ActionType, K: 'isMarked' | 'isComplated', chosenItem: IData) {
    const { temData, action } = setDataAndAction(type)
    const tempData = temData.map(item => {
      if (item.id === chosenItem.id) {
        item[K] = !item[K]
      }
      return item
    })
    action(tempData)
  }


  function filterDataById(id: number, data: IData[]) {
    let chosenData: IData[] = []
    let filterData: IData[] = []
    data.forEach(item => {
      if (item.id == id) {
        chosenData.push(item)
      } else {
        filterData.push(item)
      }
    })
    return {
      chosenData,
      filterData
    }
  }

  function setStatus(type: ActionType, K: 'isMarked' | 'isComplated', chosenItem: IData) {
    if (type == 'todo') {
      const { chosenData, filterData } = filterDataById(chosenItem.id, toDoData)
      setToDoData(filterData)
      setDoneData([...doneData, ...chosenData])
    } else {
      const { chosenData, filterData } = filterDataById(chosenItem.id, doneData)
      setDoneData(filterData)
      setToDoData([...toDoData, ...chosenData])
    }
  }


  const changeStatus = (type: ActionType, chosenItem: IData) => {
    setStatus(type, "isComplated", chosenItem)
  }

  const changeMark = (type: ActionType, chosenItem: IData) => {
    setMark(type, "isMarked", chosenItem)
  }



  return (
    <div className="bg-blue-100 p-8 flex flex-col h-full">
      <header className="text-white text-4xl font-bold">xxxx</header>
      <main>
        {/* todoData */}
        {
          toDoData.map(item => {
            return <TaskItem
              type="todo"
              key={item.id}
              changeMark={changeMark}
              changeStatus={changeStatus}
              item={item} />
          })
        }
        {/* 中间的箭头 */}
        <div className="mt-4">
          <div className="flex items-center  hover:cursor-pointer" onClick={() => setFold(!isFold)}>
            {
              isFold ? <ArrowRightOutlined className="text-2xl" /> : <ArrowDownOutlined className="text-2xl" />
            }
            <header className="text-white text-2xl font-bold">已完成({doneData.length})</header>
          </div>

          {
            doneData.map(item => {
              return <TaskItem
                type="done"
                key={item.id}
                changeMark={changeMark}
                changeStatus={changeStatus}
                item={item} />
            })
          }
        </div>


      </main>
      <footer className="mt-auto">
        <Input></Input>

      </footer>
    </div>
  )
}

export default Content