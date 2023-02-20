import React, { useContext } from "react";
import { Form, Input, Button } from "antd";
import ChangePasswordService from "services/changePasswordService";
import { AppContext } from "context/globalContext";

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const AddUser = () => {
  const { globalState } = useContext(AppContext);
  const onFinish = (values) => {
    const updatedPassword = {
      ...values,
      username: globalState.userDetails.email,
    };
    ChangePasswordService.changePassword(updatedPassword);
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <h3 className="mb-4">Change Password</h3>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Enter Old Password"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Please input your old password!",
              // pattern: "/^(?=.*[a-z])(?=.*[A-Z]){6,20}$/",
            },
          ]}
        >
          <Input.Password placeholder="Password" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Enter New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please input your new password!",
              // pattern: "/^(?=.*[a-z])(?=.*[A-Z]){6,20}$/",
            },
          ]}
        >
          <Input.Password placeholder="Password" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="cnfrmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please input confirm password!",
              // pattern: "/^(?=.*[a-z])(?=.*[A-Z]){6,20}$/",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Password" autoComplete="off" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default AddUser;
