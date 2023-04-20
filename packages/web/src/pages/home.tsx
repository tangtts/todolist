
import { Layout, Divider, List, Skeleton } from "antd"
import Header from "./components/header"
import SideItem from "./components/item"
import { StarOutlined, AlertOutlined, PlusOutlined, StarTwoTone, CalendarTwoTone } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react"
import Content from "./components/main"
import { useRequest } from 'ahooks'
import Mock from 'mockjs';
import React from "react"
import { fetchAddTaskItem, fetchInfo, fetchSearchTaskItem, fetchUpdateTaskItem } from "../request/user"
import { InfoResponse, ISideItem } from "../types"
import Search from "antd/es/input/Search"
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
function Home() {


  const [info, setInfo] = useState<InfoResponse['data']>()

  useEffect(() => {
    fetchInfo().then(res => {
      if (res) {
        setInfo(res.data)
        setSideTodoList(res.data.taskList)
        console.log(res.data)
      }
    })
  }, [])

  const [sideTodoList, setSideTodoList] = useState<ISideItem[]>([]);
  const index = useRef(0)
  const addList = () => {
    let o = {
      id: Date.now(),
      txt: `任务列表${index.current++}`,
      num: 0
    };
    fetchAddTaskItem(o).then(res => {
      setSideTodoList([...res.data])
    })
  }

  const updateItemTxt = (id: string | number | undefined, txt: string | undefined) => {
    let temp = sideTodoList.find(item => item.id == id)
    temp && (temp.txt = txt);
    fetchUpdateTaskItem(temp).then(res => {
      setSideTodoList(res.data)
    })
  }

  const onSearch = (taskName: string) => {
    fetchSearchTaskItem({ taskName }).then(res => {
      setSideTodoList(res.data)
    })
  };

  const chooseItem = (side: any) => {
    console.log(side)
  }

  return <div className="h-full flex">
    <div
      className="w-30 bg-[#f4f4f4] py-5 px-4 relative"
    >
      <Header info={info}></Header>
      <Search placeholder="input search text"
        size="large"
        allowClear
        onSearch={onSearch}
      />
      <Divider className="my-4 border-t-1 border-gray-600"></Divider>
      <div>
        <SideItem txt={'重要'} icon={<StarTwoTone />}
          id={1}
          onClick={chooseItem}
          num={10} />

        <SideItem txt={'重要'}
          onClick={chooseItem}
          id={2}
          icon={<CalendarTwoTone />} num={10} />
      </div>
      <Divider className="my-4 border-t-1 border-gray-600"></Divider>
      <div>

        <TransitionGroup className="todo-list">
          {sideTodoList?.map(side => (

            <CSSTransition
              key={side.id}
              timeout={500}
              classNames="translateY"
            >
              <SideItem
                {...side}
                updateItemTxt={updateItemTxt}
                onClick={chooseItem}
                key={side.id}
              />

            </CSSTransition>
          ))
          }

        </TransitionGroup>
      </div>
      <Divider className="my-4 border-t-1 border-gray-600"></Divider>
      <div className="flex 
          items-center 
         bg-[#f4f4f4] 
          absolute 
          bottom-1 
          inset-x-0  p-2 
          border-t-2
          border-gray-30
          hover:cursor-pointer
          hover:bg-gray-200
        "
        onClick={addList}>
        <PlusOutlined />
        <span className="ml-2">新建列表</span>
      </div>
    </div>
    <div className="flex-1">
      <Content></Content>
    </div>
  </div>
}

export default Home

