
import { Layout, Divider, List, Skeleton } from "antd"
import Header from "./components/header"
import SideItem from "./components/item"
import { StarOutlined, AlertOutlined, PlusOutlined } from "@ant-design/icons"
import { useEffect, useRef, useState } from "react"
import Content from "./components/main"
import { useRequest } from 'ahooks'
import Mock from 'mockjs';
import React from "react"
import { fetchAddTaskItem, fetchInfo, fetchSearchTaskItem, fetchUpdateTaskItem } from "../request/user"
import { InfoResponse, ISideItem } from "../types"
import Search from "antd/es/input/Search"

function Home() {


  // function createTask() {
  //   return ({
  //     id: Mock.mock("@id"),
  //     txt: Mock.mock('@name'),
  //     num: Mock.mock("@increment")
  //   })
  // }

  // function getUsername(): Promise<ITaskSideItem[]> {
  //   let data: ITaskSideItem[] = []
  //   return new Promise((resolve) => {
  //     Array.from({ length: 3 }).forEach(() => {
  //       data.push(createTask())
  //     })
  //     resolve(data)
  //   });
  // }
  // useRequest(getUsername, {
  //   onSuccess: (result) => {
  //     setSideTodoList(result)
  //   }
  // });

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
    let o: ISideItem = {
      id: Date.now(),
      txt: `任务列表${index.current++}`,
      num: 0
    }
    fetchAddTaskItem(o).then(res => {
      setSideTodoList([...res.data])
    })
  }

  const updateItemTxt = (id, txt) => {
    let temp = sideTodoList.find(item => item.id == id)
    temp && (temp.txt = txt);
    fetchUpdateTaskItem(temp).then(res => {
      setSideTodoList(res.data)
    })
  }

  const onSearch = (taskName: string) => {
    fetchSearchTaskItem({taskName}).then(res=>{
      setSideTodoList(res.data)
    })
  };

  return <div className="h-full flex">
    <div
      className="w-30 bg-gray-100 py-10 px-4 relative"
    >
      <Header info={info}></Header>
      <Search placeholder="input search text"
        size="large"
        allowClear
        onSearch={onSearch}
      />
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
              key={side.id}
              updateItemTxt={updateItemTxt}
              {...side}
            />
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

