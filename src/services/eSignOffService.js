import config from "config/config";
import http from "./httpServices";
import { message } from "antd";

export const getEsignOff = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl +
        "/esignOff/viewEsignOffData?pageNumber=" +
        filters.pageNumber,
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (err) {
    message.error("No data found!");

    return {};
  }
};

const eSignOffService = {
  getEsignOff,
};

export default eSignOffService;
