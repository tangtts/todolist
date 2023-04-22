import { Avatar, Button, Drawer, DrawerProps, Form, Input, Modal, RadioChangeEvent, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchInfo, fetchSearchTaskItem, fetchUpdateUser } from '../../request/user';
import { InfoResponse, UpdateParams, UploadResponse } from '../../types';
import { CustomerUpload } from './upload';
import { LockOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
const Header: React.FC<{ info: InfoResponse['data'], changeInfo: () => void }> = ({ info, changeInfo }) => {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [registerAvatarParams, setRegisterAvatarParams] = useState<UpdateParams['avatar']>('')
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };


  const onFinish = () => {
    const values = form.getFieldsValue() as Omit<UpdateParams, "avatar">;

    fetchUpdateUser({
      ...values,
      ...{ avatar: registerAvatarParams },
    }).then(res => {
      if (res.code == 200) {
        onClose()
        changeInfo()
      }
    })
  }



  const uploadChange = (response: UploadResponse) => {
    if (response.code == 200) {
      setRegisterAvatarParams(response.data.path)
    }
  }

  return (
    <>
      <div className='flex justify-around items-center my-4 h-14' onClick={showDrawer}>
        <Avatar size={'large'} src={info?.avatar} className='w-14 h-14' />
        <div className='flex flex-col justify-between h-full'>
          <p>{info?.nickName}</p>
          <p>{info?.phoneNumber}</p>
        </div>
      </div>
      <div>

        <Drawer
          title="Info"
          placement={"left"}
          width={400}
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button className='bg-blue-500' type="primary" onClick={onFinish}>
                OK
              </Button>
            </Space>
          }
        >
          <Form
            form={form}
            name="basic"
            size="large"
            labelAlign="left"
            layout={"vertical"}
            initialValues={{
              nickName: info.nickName,
              phoneNumber: info.phoneNumber,
              avatar: info.avatar
            }}
            className="w-full">

            <Form.Item
              label="头像"
              name="avatar"
            >
              <CustomerUpload src={info.avatar} uploadChange={uploadChange} />
            </Form.Item>

            <Form.Item
              label="用户名"
              name="nickName"
            >
              <Input prefix={<UserOutlined />} className="h-12" placeholder="NickName" />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phoneNumber"
              rules={[
                { type: "string", len: 11, message: "手机号必须在3位到8位之间" },
              ]}>
              <Input prefix={<PhoneOutlined />} className="h-12" placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
              label="旧密码"
              name="oldPassword"
              rules={[
                { type: "string", min: 3, max: 6, message: "密码长度在3位到6位之间" },
              ]}>
              <Input prefix={<LockOutlined />} className="h-12" placeholder="请输入旧密码" />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { type: "string", min: 3, max: 6, message: "密码长度在3位到6位之间" },
              ]}>
              <Input prefix={<LockOutlined />} className="h-12" placeholder="请输入新密码" />
            </Form.Item>

          </Form>
        </Drawer>
      </div>
    </>

  )
}
export default Header