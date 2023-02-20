import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getBulkReport = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl +
        "/bulkreports/viewReports?pageNumber=" +
        filters.pageNumber,
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(error.message);

    return {};
  }
};
const exportbulkReportService = {
  getBulkReport,
};

export default exportbulkReportService;
