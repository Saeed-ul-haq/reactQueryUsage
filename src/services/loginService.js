import http from "./httpServices";
import tokenStorage from "./tokenStorage";
import { message } from "antd";
import config from "config/config";
/* eslint-env node */
const jwt = require("jsonwebtoken");

/*Request for login */
export async function login(request) {
  const { data } = await http.post(config.apiUrl + "/auth/login", request);
  if (data.statusCode === 200) {
    //add token storage if needed
    tokenStorage.setToken(data.data[0]);
    return data;
  } else {
    message.error(data?.message, 10);
    // notification["warning"]({
    //   message: "Error",
    //   description: data.message,
    // });
    return null;
  }
}

/*Request for logout */
export function logout() {
  tokenStorage.clearToken();
  return true;
}

/*user information roles and will be used in protected route*/
export function getCurrentUser() {
  try {
    const userToken = localStorage.getItem("ustatus");
    const decodedData = jwt.verify(userToken, config.LOGIN_SECRET_KEY);

    return decodedData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const forgotPassword = async (userData) => {
  const { data } = await http.post(
    config.apiUrl + "/forgotPassword/recover",
    userData
  );
  if (data.statusCode === 200) {
    message.success(data?.data, 10);
    return data;
  } else {
    message.error(data.data, 10);
  }
};

// /*user information roles and will be used in protected route*/
// export function getUserSession() {
//   try {
//     const jwt = tokenStorage.getUserSession();
//     return jwt;
//   } catch (ex) {
//     return false;
//   }
// }

// /*Request for RefreshToken*/
// export async function refreshToken() {
//   try {
//     const refreshToken = tokenStorage.getRefreshToken();
//     const { data } = await http.post(config.apiUrl + "/auth/refresh", {
//       refreshToken: refreshToken,
//     });
//     tokenStorage.setToken(data);
//     console.log(data);
//     return true;
//   } catch (error) {
//     console.log("error in refresh token login service:", error);
//     return null;
//   }
// }

// export async function changePassword(request){
//   const { data } = await http.post(config.apiUrl + "/user/password-update", request);
//   if(data.statusCode === 200){
//     toast.success(data.data);
//     return data;
//   } else {
//     toast.error(data.data);
//     return data;
//   }
// }

const loginService = {
  login,
  getCurrentUser,
  logout,
  forgotPassword,
};

export default loginService;
