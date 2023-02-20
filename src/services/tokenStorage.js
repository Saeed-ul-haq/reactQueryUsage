import config from "config/config";
/* eslint-env node */
const jwt = require("jsonwebtoken");

const tokenStorage = (function () {
  function _setToken(data) {
    try {
      const encodedData = jwt.sign(data, config.LOGIN_SECRET_KEY);

      localStorage.setItem("ustatus", encodedData);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  function _clearToken() {
    localStorage.clear();
  }
  return {
    setToken: _setToken,
    clearToken: _clearToken,
  };
})();

export default tokenStorage;
