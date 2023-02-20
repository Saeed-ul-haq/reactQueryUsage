import React, { useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import LoginService from "services/loginService";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

const AppContext = React.createContext();

const AppProvider = (props) => {
  const errorHandler = useErrorHandler();
  const history = useHistory();

  const defaultState = {
    userDetails: {},
  };

  const [globalState, setGlobalState] = useState(defaultState);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    flag: false,
    userData: {},
  });

  //login helper functions

  const feedUserDataToContext = () => {
    try {
      const loggedInUserData = LoginService.getCurrentUser();

      if (!loggedInUserData) {
        return false;
      } else {
        if (!globalState.userDetails.email) {
          const userData = {
            email: loggedInUserData.email,
            firstName: loggedInUserData.firstName,
            fullName: loggedInUserData.fullName,
            id: loggedInUserData.id,
            lastName: loggedInUserData.lastName,
            userType: loggedInUserData.userType,
            userRoles: loggedInUserData.userRoles.privileges,
          };
          setUserDetails({ ...userData });
        }
        return true;
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const setUserDetails = (data) => {
    const stateCopy = { ...globalState };
    stateCopy["userDetails"] = data;
    setGlobalState(stateCopy);
  };

  const resetGlobalState = () => {
    setGlobalState(defaultState);
  };
  const logoutUser = () => {
    resetGlobalState();
    LoginService.logout();
    history.push("/login");
  };

  return (
    <AppContext.Provider
      value={{
        globalState,
        feedUserDataToContext,
        resetGlobalState,
        updateUserDetails,
        setUpdateUserDetails,
        logoutUser,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.any,
};

export { AppProvider, AppContext };
