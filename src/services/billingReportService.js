import { message } from "antd";
import config from "config/config";
import http from "./httpServices";

/*Request for Getting all billing reports */
export async function getAllBillingReports(filters) {
  try {
    const { data } = await http.post(
      config.apiUrl +
        "/billingReport/viewBillingReports?pageNumber=" +
        filters.pageNumber,
      filters.data
    );
    if (data && data.statusCode === 200) {
      return data;
    }
  } catch (err) {
    message.error("No data found!");
    console.log(err);
    return {};
  }
}
const billingService = {
  getAllBillingReports,
};
export default billingService;
