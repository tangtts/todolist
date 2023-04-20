import React from "react";
import { Button, Typography, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
const { Text, Link } = Typography;
import { AlertTwoTone, BulbTwoTone, LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons"
const Reigister: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log("Success:", values);
    navigate("/");
  };

  const goToLogin = () => {
    navigate("/login");
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
        className="  p-20
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
          className="w-full">

          <Form.Item
            label="用户名"
            name="username"
          >
            <Input prefix={<UserOutlined />} placeholder="NickName(可选)" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="PhoneNumer"
            rules={[
              { required: true, message: "请输入手机号" },
            ]}>
            <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { type: "string", min: 3, max: 8, message: "密码长度必须在3位到8位之间" },
              { required: true, message: "请输入密码" },

            ]}>
            <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confrimPassword"
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
            <Input.Password placeholder="请输入确认密码" prefix={<LockOutlined />} />
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
