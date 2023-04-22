import React, { Key, useEffect, useRef, useState } from "react"
import { BulbTwoTone, UnorderedListOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { ISideItem } from "../../types"
import type { InputRef } from 'antd';

const SideItem: React.FC<ISideItem & {chosenId:string}> = ({ icon = <BulbTwoTone />, txt = '', num = 0, id, onClick: handleClick, updateItemTxt,chosenId }) => {

  const [status, setStatus] = useState(true)
  const inputRef = useRef<InputRef>(null)

  const changeInputStatus = (id, value: string) => {
    updateItemTxt?.(id, value)
    setStatus(true)
  }

  const blur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (id) {
      changeInputStatus(id, e.target.value)
    }
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

  const onClick = () => {
    setStatus(false)
    id && handleClick(id)
  }

  return (
    <div className="
    flex   
    items-center py-2  rounded-sm
    transition-all
    duration-150
    hover:bg-gray-300
    hover:cursor-pointer
    bg-gray-100
    mt-2
    h-12
    "
    style={{backgroundColor: chosenId==id ?  'rgb(243 244 246)' : "rgb(191,219,254)"}}
      onClick={onClick}
    >

      <div className="w-[4px] h-4/5 mr-2 bg-blue-300 rounded-md">
      </div>
      <div className="flex items-center">
        {icon}
        {
          status ? <p className="ml-4">{txt}</p>

            : <Input defaultValue={txt} onPressEnter={(e) => enter(e)} onBlur={(e) => blur(e)} ref={inputRef}></Input>
        }

      </div>
      <span className="bg-gray-200 ml-auto mr-2 rounded-full flex items-center justify-center w-6 font-thin aspect-square">{num?.toString()}</span>
    </div>
  )
}
export default SideItem