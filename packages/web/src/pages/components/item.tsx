import React, { Key, useEffect, useRef, useState } from "react"
import { BulbTwoTone, UnorderedListOutlined } from "@ant-design/icons"
import { ISideItem } from "../../types"
import type { InputRef } from 'antd';
import { Dropdown, Input, MenuProps } from "antd"
import { deleteTaskList } from "../../request/task";
const SideItem: React.FC<ISideItem & { chosenId: string | number, notInput?: boolean, getInfo?: Function }> = ({ icon = <BulbTwoTone />, txt = '', num = 0, id, onClick: handleClick, updateItemTxt, chosenId, notInput = false, getInfo }) => {

  // 是否是state状态
  const [status, setStatus] = useState(true)
  const inputRef = useRef<InputRef>(null)

  const changeInputStatus = (id, value: string) => {
    updateItemTxt?.(id, value)
    setStatus(true)
  }

  const blur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    changeInputStatus(id, e.target.value)
  }

  const enter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    changeInputStatus(id, ((e.target) as HTMLInputElement).value)
  }

  useEffect(() => {
    if (!status) {
      inputRef.current?.focus({
        cursor: 'end'
      })
    }
  }, [status])


  // 点击侧边向父组件抛出事件
  const onClick = () => {
    handleClick(id, txt)
  }
  const items: MenuProps['items'] = [
    {
      label: '删除',
      key: '1',
    },
    {
      label: '修改',
      key: '2',
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key == 2) {
      if (!notInput) {
        return setStatus(false)
      }
      return setStatus(true)
    }
    // 删除其中的一个列表
    deleteTaskList({ id }).then(res => {
      console.log(res)
      if (res.code == 200) {
        getInfo?.()
      }
    })
  }

  return (<>
    <Dropdown menu={{ items, onClick: handleMenuClick, disabled: notInput }} trigger={['contextMenu']}>
      <div className="
        flex   
        items-center 
        py-2  
        rounded-sm
        transition-all
        duration-150
        hover:bg-gray-300
        hover:cursor-pointer
        mt-2
        h-12
    "
        style={{ backgroundColor: chosenId == id ? 'rgb(96 165 250)' : "rgb(191,219,254)" }}
        onClick={onClick}
      >

        <div className="w-[4px] h-4/5 mr-2 bg-blue-300 rounded-md"></div>
        <div className="flex items-center">
          {icon}
          {
            status ? <p className="ml-4">{txt}</p>

              : <Input defaultValue={txt} onPressEnter={(e) => enter(e)} onBlur={(e) => blur(e)} ref={inputRef}></Input>
          }

        </div>
        <span className="bg-gray-200 ml-auto mr-2 rounded-full flex items-center justify-center w-6 font-thin aspect-square">{num?.toString()}</span>
      </div>
    </Dropdown>
  </>

  )
}
export default SideItem