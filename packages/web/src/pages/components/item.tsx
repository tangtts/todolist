import React, { Key, useState } from "react"
import { UnorderedListOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { ISideItem } from "../../types"



function SideItem({ icon, txt, num, updateItemTxt, id }: ISideItem = { icon: <UnorderedListOutlined />, txt: "", num: 0, id: "" }) {

  const [status, setStatus] = useState(true)

  const blur = (e: React.FocusEvent<HTMLInputElement, Element>) => {

    if (id) {
      updateItemTxt?.(id, e.target.value)
    }
    setStatus(true)
  }

  return (
    <div className="flex   items-center py-2 bg-red-200 rounded-sm
    transition-all
    duration-150
    hover:bg-green-200
    mt-2
    h-12
    "
    >

      <div className="w-[4px] h-4/5 mr-2 bg-blue-300 rounded-md">
      </div>
      <div className="flex items-center">
        {icon}
        {
          status ? <p className="ml-4" onClick={() => { setStatus(false) }}>{txt}</p>

            : <Input defaultValue={txt} onBlur={(e) => blur(e)}></Input>
        }

      </div>
      <span className="bg-gray-200 ml-auto mr-2 rounded-full flex items-center justify-center w-6 font-thin aspect-square">{num?.toString()}</span>
    </div>
  )
}
export default SideItem