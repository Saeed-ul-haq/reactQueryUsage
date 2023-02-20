import { message } from "antd";
import config from "config/config";
import { convertToProperCase } from "utils/GeneralHelper";
import http from "./httpServices";

const getViewUserList = async (filters) => {
  try {
    const { data } = await http.get(config.apiUrl + "/user/viewAllUsers");

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (err) {
    message.error("Something went wrong!");
    console.log(err);
    return {};
  }
};
const deleteUser = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/user/deleteuser",
      filters
    );

    if (data.statusCode === 200) {
      message.success("User deleted successfully");
      return;
    }
    return {};
  } catch (err) {
    message.error("Something went wrong!");

    return {};
  }
};

const addUser = async (userData) => {
  const { data } = await http.post(config.apiUrl + "/user/adduser", userData);

  if (data.statusCode === 200) {
    message.success(data?.data, 10);
    return data;
  } else {
    message.error(convertToProperCase(data?.data), 10);
    return [];
  }
};
const updateUser = async (userData) => {
  const { data } = await http.post(
    config.apiUrl + "/user/updateUser",
    userData
  );

  if (data.statusCode === 200) {
    message.success("user updated successfully");
    return data;
  } else {
    message.error(convertToProperCase(data?.data), 10);

    return [];
  }
};

const viewUserReportService = {
  addUser,
  deleteUser,
  updateUser,
  getViewUserList,
};

export default viewUserReportService;
