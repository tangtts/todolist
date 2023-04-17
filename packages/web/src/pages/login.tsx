import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log("Success:", values);
    navigate("/");
  };
  return (
    <div
      className="h-screen 
        w-full
        flex-center 
      bg-yellow-100
      ">
      <div
        className="p-20 
              border-blue-400
              bg-blue-200
              shadow-gray-400  
               shadow-md
               rounded-md 
               border-2 
               w-1/2 
               flex-center">
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          className="w-full">
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="bg-blue-500">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
