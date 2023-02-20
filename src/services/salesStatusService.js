import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
import { convertToProperCase } from "utils/GeneralHelper";

export const getAllSalesStatus = async (page) => {
  const { data } = await http.get(
    config.apiUrl + "/SaleStatus/?pageNumber=" + page
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

export const getFilteredSalesStatus = async (filters) => {
  const { data } = await http.post(
    config.apiUrl +
      "/SaleStatus/filterSaleStatus?pageNumber=" +
      filters.pageNumber,
    filters.data
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

export const getSimDetails = async (id, page = 1) => {
  const { data } = await http.post(
    config.apiUrl + "/SaleStatus/getSimDetailData?pageNumber=" + page,
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

const SalesStatusService = {
  getAllSalesStatus,
  getFilteredSalesStatus,
  getSimDetails,
};

export default SalesStatusService;
