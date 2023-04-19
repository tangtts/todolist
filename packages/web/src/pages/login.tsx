import React from "react";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios"
// import a from ""
import { LoginParmas } from "../types";
import { fetchLogin } from "../request/user";


const Login: React.FC = () => {

  const navigate = useNavigate();
  
  const onFinish = (values: LoginParmas) => {
    fetchLogin(values).then(res=>{
      if(res.code == 200){
        localStorage.setItem('token',res.data.token);
        navigate("/");
      }
    })
    
    
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
          initialValues={{
            phoneNumber:"18623816694",
            password:"123456"
          }}
          className="w-full">
          <Form.Item
            label="手机号"
            name="phoneNumber"
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

          <Form.Item
            label="Captcha"
            extra="We must make sure that your are a human."
            rules={[{ required: true, message: 'Please input the captcha you got!' }]}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Input />
              </Col>

              <Col span={8}>

                <Button>Get captcha</Button>

              </Col>
            </Row>
          </Form.Item>



          <Form.Item name="remember" valuePropName="checked"
          >
            <Checkbox defaultChecked={true}>Remember me</Checkbox>
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
