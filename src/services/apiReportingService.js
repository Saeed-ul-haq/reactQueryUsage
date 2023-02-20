import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getApiReports = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl +
        "/apiReporting/viewApiReports?pageNumber=" +
        filters.pageNumber,
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (err) {
    message.error("Something went wrong!");

    return {};
  }
};

const exportApiReportServices = {
  getApiReports,
};

export default exportApiReportServices;
