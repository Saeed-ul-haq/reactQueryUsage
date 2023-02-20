import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
import { convertToProperCase } from "utils/GeneralHelper";

export const getSocReports = async (page = 1) => {
  try {
    const { data } = await http.get(config.apiUrl + "/Soc/?pageNumber=" + page);

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    notification["warning"]({
      message: "Error",
      description: convertToProperCase(error.message),
    });
    return [];
  }
};

export const getSimOrderDetails = async (id, page = 1) => {
  const { data } = await http.post(
    config.apiUrl + "/Soc/ViewsimDetailsData?pageNumber=" + page,
    { id: id }
  );

  if (data.statusCode === 200) {
    return data;
  } else {
    notification["warning"]({
      message: "Error",
      description: convertToProperCase(data.message),
    });
    return [];
  }
};

export const getRejectedOrderDetails = async (id, page = 1) => {
  const { data } = await http.post(
    config.apiUrl + "/Soc/ViewRejectionDetailsData?pageNumber=" + page,
    { id: id }
  );

  if (data.statusCode === 200) {
    return data;
  } else {
    notification["warning"]({
      message: "Error",
      description: convertToProperCase(data.message),
    });
    return [];
  }
};
export const getWaiverDocuments = async (id, page = 1) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/Soc/viewWaiverDocumentsData?pageNumber=" + page,
      { id: id }
    );

    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    notification["warning"]({
      message: "Error",
      description: convertToProperCase(error.message),
    });
    return [];
  }
};

const SocServices = {
  getSocReports,
  getSimOrderDetails,
  getRejectedOrderDetails,
  getWaiverDocuments,
};

export default SocServices;
