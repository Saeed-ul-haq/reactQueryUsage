import config from "config/config";
import http from "./httpServices";

const downloadAllReports = async (body, headers) => {
  const { data = "" } = await http.post(
    config.apiUrl + "/email/emailReports",
    body,
    {
      headers,
    }
  );
  return data;
};

export default downloadAllReports;
