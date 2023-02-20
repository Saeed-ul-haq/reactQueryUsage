import { message } from "antd";
import config from "config/config";
import { convertToProperCase } from "utils/GeneralHelper";
import http from "./httpServices";

/*Request for Getting all billing reports */
export async function getUserType(url, filters) {
  try {
    const { data } = await http.post(
      config.apiUrl + url + filters.pageNumber,
      filters.data
    );
    if (data.statusCode === 200) {
      return data;
    }
    return {};
  } catch (error) {
    message.error(convertToProperCase(error.message));
    // notification["warning"]({
    //   message: "Error",
    //   description: convertToProperCase(error.message),
    // });
    return {};
  }
}
const UserTypeServices = {
  getUserType,
};
export default UserTypeServices;
