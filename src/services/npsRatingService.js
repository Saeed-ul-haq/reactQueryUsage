import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getNpsRatingList = async (filter) => {
  const { data } = await http.post(
    config.apiUrl + "/npsRating/npsRatingList?pageNumber=" + filter.pageNumber,
    filter.data
  );

  if (data.statusCode === 200) {
    if (data?.data.length < 1) {
      message.warning("NO data found");
    }
    return data;
  } else {
    message.error(data?.message);
    return [];
  }
};

export const getNpsRemindList = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl + "/npsRating/npsRmlView?pageNumber=" + filters.pageNumber,
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    if (data?.data.length < 1) {
      message.warning("No Data found");
    }
    return [];
  } catch (err) {
    message.error("Something went wrong");

    return [];
  }
};

const NpsService = {
  getNpsRatingList,
  getNpsRemindList,
};

export default NpsService;
