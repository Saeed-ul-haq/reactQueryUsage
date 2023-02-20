import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const changePassword = async (values) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/changePassword/submitNewPassword",
      values
    );
    if (data.statusCode === 200) {
      message.success("Password updated successfully");

      return data;
    }
    return {};
  } catch (err) {
    message.error('"Something went wrong!"');

    console.log(err);
    return {};
  }
};

const exportChangePasswordServices = {
  changePassword,
};

export default exportChangePasswordServices;
