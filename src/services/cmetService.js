import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getAllCmetData = async () => {
  try {
    const { data } = await http.get(config.apiUrl + "/Cmet/");
    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(error?.message);

    return [];
  }
};
export const viewOrderDetail = async (value, page = 1) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/Cmet/ViewsimDetailsData?pageNumber=" + page,
      { id: value }
    );
    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(error?.message);

    return [];
  }
};
export const viewRejectionDetail = async (id, page = 1) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/Cmet/ViewRejectionDetailsData?pageNumber=" + page,
      { id: id }
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(error?.message);

    return [];
  }
};
export const getWaiverDocuments = async (id, page = 1) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/Cmet/getWaiverDocumentsData?pageNumber=" + page,
      { id: id }
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(error?.message);
    return [];
  }
};

const cMetService = {
  getAllCmetData,
  viewOrderDetail,
  viewRejectionDetail,
  getWaiverDocuments,
};
export default cMetService;
