import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

export const getAllFeedback = async (page = 1) => {
  const { data } = await http.get(
    config.apiUrl + "/generalFeedback/viewFeedbackData?pageNumber=" + page
  );

  if (data.statusCode === 200) {
    return data;
  } else {
    message.error(data?.message);
    return [];
  }
};

export const getFilteredFeedback = async (filters) => {
  try {
    const { data } = await http.post(
      config.apiUrl +
        "/generalFeedback/viewFilterFeedbackData?pageNumber=" +
        filters.pageNumber,
      filters.data
    );

    if (data.statusCode === 200) {
      return data;
    }
    return [];
  } catch (err) {
    message.error("Something went wrong");

    return [];
  }
};

export const getCommentDetails = async (id) => {
  const { data } = await http.post(
    config.apiUrl + "/generalFeedback/getcommentDetail",
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
    message.error(data?.message);

    return [];
  }
};

export const putCommentsOnFeedback = async (filters) => {
  const { data } = await http.post(
    config.apiUrl + "/generalFeedback/addUpdateComment",
    filters
  );

  if (data.statusCode === 200) {
    return data;
  } else {
    message.error(data?.message);

    return [];
  }
};

const GeneralFeedbackServices = {
  getFilteredFeedback,
  getAllFeedback,
  getCommentDetails,
  putCommentsOnFeedback,
};

export default GeneralFeedbackServices;
