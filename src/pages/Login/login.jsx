import React, { useState, Fragment, useContext, useEffect } from "react";
import "./login.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Card } from "antd";
import JazzLogo from "assets/images/JazzLogo.png";
import LoginService from "services/loginService";
import { AppContext } from "context/globalContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const isUserLoggedin = LoginService.getCurrentUser();
    if (isUserLoggedin) history.push("/jazz");
    // eslint-disable-next-line
  }, []);
  const { feedUserDataToContext } = useContext(AppContext);

  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getLoginDetails = async (userObject) => {
    const res = await LoginService.login(userObject);
    return res;
  };

  const onFinish = (userObject) => {
    setLoading(true);
    const res = getLoginDetails(userObject);

    res.then((data) => {
      if (data) {
        setLoading(false);
        const loggedInUserData = data.data[0];
        feedUserDataToContext(loggedInUserData);
        history.push("/jazz");
      }
      setLoading(false);
    });
  };

  const onForgotPass = async (values) => {
    setLoading(true);
    const data = await LoginService.forgotPassword(values);
    setLoading(false);
    console.log(data);
    return data;
  };

  return (
    <Fragment>
      <Modal
        maskTransitionName=""
        title="Forgot Password"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onForgotPass}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
          // wrapperCol={{
          //   offset: 8,
          //   span: 16,
          // }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              {!loading ? "Submit" : "loading"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="login-bg">
        <img src={JazzLogo} className="mb-4" alt="logo" />
        <Card
          title="Login"
          headStyle={{ background: "#8c1007", color: "white" }}
          bordered={false}
          style={{ width: 500 }}
        >
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <div className="login-form-forgot" onClick={showModal}>
                Forgot password
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="login-form-button primary-bg"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Fragment>
  );
};

export default Login;
