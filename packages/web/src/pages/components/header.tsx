import { Avatar, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchInfo } from '../../request/user';
import { InfoResponse } from '../../types';
const { Search } = Input;
const onSearch = (value: string) => console.log(value);
function Header() {
 const [info,setInfo] =  useState<InfoResponse['data']>()
 useEffect(()=>{
  fetchInfo().then(res=>{
    if(res){
      setInfo(res.data)
    }
  })
 },[])
  
  return (
    <Space direction="vertical">
      <div className='flex justify-around items-center'>
        <div className='left'>
          <Avatar size={'large'}  src={info?.avatar}/>
        </div>
        <div className='flex flex-col my-4'>
          <span>{info?.nickName}</span>
          <p >{info?.phoneNumber}</p>
        </div>
      </div>
      <Search placeholder="input search text"
        size='middle'
        allowClear onSearch={onSearch}
      />
    </Space>
  )
}
export default Header