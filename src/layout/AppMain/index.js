import { message } from "antd";
import LoadingScreen from "components/common/loadingScreen";
import { AppContext } from "context/globalContext";
import AppRoutes from "layout/AppMain/Routes/Private";
import { Suspense } from "react";

import BaseLayout from "layout/AppMain/BaseLayout";
import { publicRoutes } from "layout/AppMain/Routes/public";
import { useContext, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

const renderPublicRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {publicRoutes.map((Obj, index) => (
          <Route exact path={Obj.path} component={Obj.component} key={index} />
        ))}
      </Switch>
    </Suspense>
  );
};

const AppMain = () => {
  const { feedUserDataToContext, logoutUser, globalState } =
    useContext(AppContext);
  const history = useHistory();
  useEffect(() => {
    const isLoginSuccessfull = feedUserDataToContext();
    if (!isLoginSuccessfull) history.push("/login");
    // eslint-disable-next-line
  }, [globalState]);

  useEffect(() => {
    setTimeout(() => {
      message.warning("Session has been expired!");

      logoutUser();
    }, 2700000);
    // eslint-disable-next-line
  });

  const isLoginSuccessfull = feedUserDataToContext();

  if (!isLoginSuccessfull) {
    return (
      <>
        {renderPublicRoutes()}
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      </>
    );
  }

  return (
    <BaseLayout>
      <AppRoutes />
    </BaseLayout>
  );
};
export default AppMain;
