import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
export const getOrderHistory = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/orderHistory/viewOrderHistoryData",
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (err) {
    notification["warning"]({
      message: "Error",
      description: "No data found",
    });
    console.log(err);
    return {};
  }
};

const orderHistoryService = {
  getOrderHistory,
};

export default orderHistoryService;
