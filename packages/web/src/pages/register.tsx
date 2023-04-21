import React, { useRef, useState } from "react";
import { Button, Typography, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
const { Text, Link } = Typography;
import { AlertTwoTone, BulbTwoTone, LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons"
import { fetchRegister } from "../request/user";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { CustomerUpload } from "./components/upload";
import { RegisterParams, UploadResponse } from "../types";



const Reigister: React.FC = () => {
  const navigate = useNavigate();

  const registerParams:RegisterParams ={
    nickName: "",
    phoneNumber: "",
    password: "",
    password_confirmed: "",
    avatar: ""
  }

  const onFinish = (values: RegisterParams) => {
    registerParams.nickName = values.nickName
    registerParams.phoneNumber = values.phoneNumber
    registerParams.password = values.password
    registerParams.password_confirmed = values.password_confirmed
    fetchRegister(registerParams).then(res => {
      navigate("/")
    })
  };

  const goToLogin = () => {
    navigate("/login");
  }


  const uploadChange = (response: UploadResponse) => {
    if (response.code == 200) {
      registerParams.avatar = response.data.path
    }
  }


  return (
    <div
      className="h-screen 
      w-full
      flex-col
      flex
      justify-center
      items-center
    ">

      <BulbTwoTone className="text-4xl hover:rotate-180 origin-bottom duration-200" />
      <div
        className="p-20
        border-blue-400
        shadow-orange-100
        hover:shadow-2xl 
         duration-200
         shadow-md
         rounded-md 
         border-2 
         w-1/2 
         bg-blue-100
               ">
        <p className="text-2xl text-center cursor-pointer">注册 </p>
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          labelAlign="left"
          layout={"vertical"}
          initialValues={{
            nickName: "好大鸭",
            phoneNumber: "18623816694",
            password: "123456",
            password_confirmed: "123456",
            avatar: ""
          }}
          className="w-full">

          <Form.Item
            label="头像"
            name="avatar"
          >
            <CustomerUpload uploadChange={uploadChange} />
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
              { required: true, message: "请输入手机号" },
            ]}>
            <Input prefix={<PhoneOutlined />} className="h-12" placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { type: "string", min: 3, max: 8, message: "密码长度必须在3位到8位之间" },
              { required: true, message: "请输入密码" },

            ]}>
            <Input.Password placeholder="请输入密码" className="h-12" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="password_confirmed"
            rules={[
              { type: "string", min: 3, max: 8, message: "密码长度必须在3位到8位之间" },
              { required: true, message: "请输入密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}>
            <Input.Password placeholder="请输入确认密码" className="h-12" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Link className="float-right" onClick={goToLogin}>已有账号？去登录</Link>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="bg-blue-500 w-1/2 mx-auto flex justify-center">
              Submit
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
};

export default Reigister;
