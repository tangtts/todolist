import { Layout, Divider, List, Skeleton } from "antd";
import Header from "./components/header";
import SideItem from "./components/side";
import {
  StarOutlined,
  AlertOutlined,
  PlusOutlined,
  StarTwoTone,
  CalendarTwoTone,
  HeartOutlined,
  HeartTwoTone,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Content, { ContentType } from "./components/main";
import { useRequest } from "ahooks";
import Mock from "mockjs";
import React from "react";
import {
  fetchAddTaskItem,
  fetchInfo,
  fetchSearchTaskItem,
  fetchUpdateTaskItem,
} from "../request/user";
import { InfoResponse, ISideItem } from "../types";
import Search from "antd/es/input/Search";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { fetchComplatedTask, fetchFilterTask } from "../request/task";
import { useAppDispatch, useAppSelector } from "../hook";
import { changeSideTxt, setChosenId } from "../store/taskSlice";
function Home() {
  const [userInfo, setUserInfo] = useState<InfoResponse["data"]>();
  const [sideTodoList, setSideTodoList] = useState<ISideItem[]>([]);
  // 起始列表第一项
  const index = useRef(0);
  const dispatch  =  useAppDispatch();
  const {sideNum,markedNum} = useAppSelector(state=>state.task)
  /**
   * @description 获取用户信息
   */
  const getInfo = () => {
    fetchInfo().then(res => {
      if (res) {
        setUserInfo(res.data);
        setSideTodoList(res.data.taskList);
      }
    });
  }

  useEffect(() => {
    getInfo();
  }, []);


  /**
   * @description 新增列表
   */
  const addList = () => {
    let o = {
      id: Date.now(),
      txt: `任务列表${index.current++}`,
      num: 0,
    };
    fetchAddTaskItem(o).then(res => {
      if(res.code == 200){
        dispatch(setChosenId(res.data.id))
        dispatch(changeSideTxt(res.data.txt))
        getInfo()
      }
    });
  };

  /**
   * @description 更新侧边文字
   * @param {(string | number | undefined)} id
   * @param {(string | undefined)} txt
   */
  const updateItemTxt = (
    id: string | number,
    txt: string | undefined
  ) => {
    if (!txt) return;
    let temp = sideTodoList.find(item => item.id == id);
    if ((txt === temp?.txt)) return;
    temp && (temp.txt = txt);
    fetchUpdateTaskItem(temp).then(res => {
      dispatch(changeSideTxt(temp?.txt))
      setSideTodoList(res.data);
    });
  };

  /**
   * @description 根据 taskName 搜索
   * @param {string} taskName
   */
  const onSearch = (taskName: string) => {
    fetchSearchTaskItem({ taskName }).then(res => {
      setSideTodoList(res.data);
    });
  };


  return (
    <div className="h-full flex">
      <div className="w-30 bg-[#f4f4f4] py-5 px-4 relative">
        {userInfo?._id && <Header changeInfo={getInfo} info={userInfo}></Header>}
        <Search
          placeholder="input search text"
          size="large"
          allowClear
          onSearch={onSearch}
        />
        <Divider className="my-4 border-t-1 border-gray-600"></Divider>
        <div>
        <SideItem 
            txt={'已完成'}
            id={1}
            notInput
            icon={<CalendarTwoTone />}
            num={userInfo?.isComplatedCount ?? 0} />

          <SideItem 
            txt={'标记'} 
            icon={<HeartTwoTone />}
            id={2}
            notInput
            num={markedNum} />

        </div>
        <Divider className="my-4 border-t-1 border-gray-600"></Divider>
        <div>
          <TransitionGroup className="todo-list">
            {sideTodoList?.map(side => (
              <CSSTransition
                key={side.id}
                timeout={500}
                classNames="translateY">
                <SideItem
                {...side}
                updateItemTxt={updateItemTxt}
                getInfo={getInfo}  
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
        <Divider className="my-4 border-t-1 border-gray-600"></Divider>
        <div
          className="flex 
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
        <Content  getInfo={getInfo} />
      </div>
    </div>
  );
}

export default Home;
