// import http from "./httpServices";
// import { notification } from "antd";
// import config from "config/config";// import { convertToProperCase } from "utils/GeneralHelper";

// // export async function getOtpForRegister(request) {
// //   try {
// //     let apiReq = { ...request, identity: utils.makeIdentity(request.identity) };
// //     const { data } = await http.post(config.apiUrl + "getotpforregistration", apiReq);
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// // export async function getOtpRegister(request) {
// //   try {
// //     let apiReq = { ...request, identity: utils.makeIdentity(request.identity) };
// //     const { data } = await http.post(config.apiUrl + "getotp", apiReq);
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// // export async function forgotPassword(request) {
// //   try {
// //     let apiReq = { ...request, identity: utils.makeIdentity(request.identity) };
// //     delete apiReq.confirmPassword;
// //     const { data } = await http.post(config.apiUrl + "forgotpassword", apiReq);
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// // export async function setPassword(request, userProfile) {
// //   try {
// //     let apiReq = {
// //       ...request,
// //       identity: utils.makeIdentity(request.identity),
// //       userProfile,
// //     };
// //     const { data } = await http.post(config.apiUrl + "activate", apiReq);
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// // export async function getusertype(profile) {
// //   try {
// //     const { data } = await http.post(config.apiUrl + "getusertype", profile);
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// // export async function updateAddress(request) {
// //   try {
// //     let apiReq = { ...request, identity: utils.makeIdentity(request.identity) };
// //     const { data } = await http.post(
// //       config.apiUrl + "updateaccountholderaddress",
// //       apiReq
// //     );
// //     return data;
// //   } catch (e) {
// //     console.log(e);
// //     return false;
// //   }
// // }

// export default {
//   getOtpForRegister,
//   setPassword,
//   forgotPassword,
//   getOtpRegister,
//   getusertype,
//   updateAddress,
// };
