
import { Layout, Divider, List, Skeleton } from "antd"
import Header from "./components/header"
import SideItem, { ISideItem } from "./components/item"
import { StarOutlined, AlertOutlined, PlusOutlined } from "@ant-design/icons"
import { useRef, useState } from "react"
import Content from "./components/main"
import { useRequest } from 'ahooks'
import Mock from 'mockjs';
import React from "react"

function Home() {
  interface ITaskSideItem extends ISideItem {
    id: string | number
  }
  function createTask() {
    return ({
      id: Mock.mock("@id"),
      txt: Mock.mock('@name'),
      num: Mock.mock("@increment")
    })
  }

  function getUsername(): Promise<ITaskSideItem[]> {
    let data: ITaskSideItem[] = []
    return new Promise((resolve) => {
      Array.from({ length: 3 }).forEach(() => {
        data.push(createTask())
      })
      resolve(data)
    });
  }
  useRequest(getUsername, {
    onSuccess: (result) => {
      setSideTodoList(result)
    }
  });

  const [sideTodoList, setSideTodoList] = useState<ITaskSideItem[]>([]);

  const addList = () => {
    let temp: ITaskSideItem = createTask()
    setSideTodoList([...sideTodoList, temp])
  }


  return <div className="h-full flex">
    <div
      className="w-30 bg-gray-100 py-10 px-4 relative"
    >
      <Header></Header>
      <Divider className="my-4 border-t-2 border-cyan-300"></Divider>
      <div>
        <SideItem txt={'重要'} icon={<StarOutlined />} num={10}></SideItem>
        <SideItem txt={'重要'} icon={<AlertOutlined />} num={10}></SideItem>
      </div>
      <Divider className="my-4 border-t-2 border-cyan-300"></Divider>
      <div>
        {
          sideTodoList?.map(side => {
            return <SideItem
              txt={side.txt}
              key={side.id}
              num={side.num} />
          })
        }
      </div>
      <Divider className="my-4 border-t-2 border-cyan-300"></Divider>
      <div className="flex items-center bg-red-300 absolute bottom-1 inset-x-0  p-2" onClick={addList}>
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

