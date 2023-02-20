import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
/*Request for View All Reports */
export async function getAllReports(filters) {
  const { data } = await http.post(
    config.apiUrl + "/loginreports/viewReports?pageNumber=" + filters.pageNumber,
    filters.data
  );
  if (data.statusCode === 200) {
    return data;
  } else {
    notification["warning"]({
      message: "Error",
      description: data.message,
    });
    return [];
  }
}

const loginReportServices = {
  getAllReports,
};

export default loginReportServices;
