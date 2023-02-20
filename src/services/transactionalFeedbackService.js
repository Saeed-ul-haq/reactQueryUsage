import http from "./httpServices";
import { notification } from "antd";
import config from "config/config";
import { convertToProperCase } from "utils/GeneralHelper";

export const getAllFeedback = async (page = 1) => {
  const { data } = await http.get(
    config.apiUrl + "/transactionalFeedback/viewFeedbackData?pageNumber=" + page
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

export const getFilteredFeedback = async (filters) => {
  const { data } = await http.post(
    config.apiUrl +
      "/transactionalFeedback/viewFeedbackDatafilter?pageNumber=" +
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

export const getCommentDetails = async (id) => {
  const { data } = await http.post(
    config.apiUrl + "/transactionalFeedback/getcommentDetail",
    { id: id },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
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

export const putCommentsOnFeedback = async (filters) => {
  const { data } = await http.post(
    config.apiUrl + "/transactionalFeedback/addUpdateComment",
    filters
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

const TransactionalFeedbackServices = {
  getFilteredFeedback,
  getAllFeedback,
  getCommentDetails,
  putCommentsOnFeedback,
};

export default TransactionalFeedbackServices;
