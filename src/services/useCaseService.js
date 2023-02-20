import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getUsecases = async (pageName) => {
  try {
    const { data } = await http.get(
      config.apiUrl + "/apiReporting/GetUseCasesList?fromPage=" + pageName
    );
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

export default getUsecases;
