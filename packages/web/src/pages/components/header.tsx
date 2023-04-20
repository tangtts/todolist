import { Avatar, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchInfo, fetchSearchTaskItem } from '../../request/user';
import { InfoResponse } from '../../types';

const Header: React.FC<{ info: InfoResponse['data'] | undefined }> = ({ info }) => {

  return (
    <div className='flex justify-around items-center'>

      <Avatar size={'large'} src={info?.avatar} />

      <div className='flex flex-col my-4'>
        <span>{info?.nickName}</span>
        <p>{info?.phoneNumber}</p>
      </div>
    </div>

  )
}
export default Header