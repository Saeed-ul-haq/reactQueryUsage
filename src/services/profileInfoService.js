import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
/*Request for View All Reports */
export async function getAllProfileInfo(filters) {
  const res = await http.post(config.apiUrl + "/profileview", filters.data);
  if (res.status === 200) {
    return res.data.profileViewDataResponse.dataResponseArrayList;
  } else {
    notification["warning"]({
      message: "Error",
      description: res?.data.message,
    });
    return [];
  }
}

const loginReportServices = {
  getAllProfileInfo,
};

export default loginReportServices;
