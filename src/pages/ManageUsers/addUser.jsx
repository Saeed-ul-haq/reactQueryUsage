import { Button, Form, Input } from "antd";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import { Fragment, useContext, useEffect } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useHistory, useLocation } from "react-router-dom";
import ManageUserService from "services/viewUserService";

const tailLayout = {
  wrapperCol: { offset: 3, span: 16 },
};

const USER_TYPE_LIST = [
  { key: "", displayValue: "Select User Type" },
  { key: 1, displayValue: "Admin" },
  { key: 2, displayValue: "Normal" },
  { key: 3, displayValue: "SOC" },
  { key: 4, displayValue: "CMET" },
];

const AddUser = () => {
  const { updateUserDetails, setUpdateUserDetails } = useContext(AppContext);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const { state = "", pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    return () => {
      if (updateUserDetails.flag)
        setUpdateUserDetails({ flag: false, userData: {} });
    };
    // eslint-disable-next-line
  }, []);
  const { userData = {} } = state;
  useEffect(() => {
    form.setFieldsValue({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      username: userData?.userName,
      userRoles: userData?.userRoles?.id,
    });
    // eslint-disable-next-line
  }, [state, pathname]);

  const onFinish = async (values) => {
    try {
      await ManageUserService.addUser(values);
      form.resetFields();
    } catch (error) {
      errorHandler(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const updateUser = async (values) => {
    try {
      await ManageUserService.updateUser({
        ...values,
        userId: userData?.id,
        roleId: values.userRoles,
      });
      history.push("/jazz/users");
    } catch (error) {
      errorHandler(error);
    }
  };
  return (
    <Fragment>
      <h3 className="mb-4">
        {updateUserDetails.flag ? "Update User" : "Add New User"}
      </h3>

      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 9 }}
        form={form}
        name="basic"
        initialValues={{
          userName: "",
          firstName: "",
          lastName: "",
          userType: "",
        }}
        onFinish={updateUserDetails.flag ? updateUser : onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="User Name"
          name="username"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input E-mail!",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="abc@gmail.com"
            disabled={updateUserDetails?.flag}
          />
        </Form.Item>
        <Form.Item
          label="Fisrt Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input Last Name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: "Please select user type!" }]}
          name="userRoles"
          label="User Type"
        >
          <SelectDropdown items={USER_TYPE_LIST} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button htmlType="submit">
            {updateUserDetails.flag ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};
export default AddUser;
