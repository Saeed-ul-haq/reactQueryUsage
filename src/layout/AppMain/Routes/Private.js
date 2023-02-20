import "App.css";
import LoadingScreen from "components/common/loadingScreen";
import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
import {
  ADD_USER,
  API_REPORT,
  AUDIT_LOGS,
  BILLING_REPORT,
  BULK_REPORT,
  CHANGE_PASSWORD,
  CMET,
  E_SIGNOFF,
  GENERAL_FEEDBACK,
  HOME,
  LOGIN_REPORT,
  NPS_RATING,
  NPS_RATING_REMIND_LETTER,
  ORDER_HISTORY,
  PROFILE_INFO,
  SALES,
  SERVICE_REPORT,
  SOC,
  TRANSACTIONAL_FEEDBACK,
  UPDATE_USER,
  URL,
  USERS,
  USER_REPORT,
} from "Settings/constant";

const ROUTES = [
  {
    path: HOME,
    component: () => (
      <div>
        <h3>Welcome to Jazz Reporting Portal !</h3>
      </div>
    ),
    exact: true,
  },
  {
    path: LOGIN_REPORT,
    component: lazy(() => import("pages/LoginReport/loginReport")),
    exact: true,
  },
  {
    path: BILLING_REPORT,
    component: lazy(() => import("pages/BillingReports/billingReports")),
    exact: true,
  },
  {
    path: USER_REPORT,
    component: lazy(() => import("pages/UserReport/userReport")),
    exact: true,
  },
  {
    path: BULK_REPORT,
    component: lazy(() => import("pages/BulkReport/bulkReport")),
    exact: true,
  },
  {
    path: USERS,
    component: lazy(() => import("pages/ManageUsers/viewEditUser")),
    exact: true,
  },
  {
    path: UPDATE_USER,
    component: lazy(() => import("pages/ManageUsers/addUser")),
    exact: true,
  },
  {
    path: ADD_USER,
    component: lazy(() => import("pages/ManageUsers/addUser")),
    exact: true,
  },
  {
    path: ORDER_HISTORY,
    component: lazy(() => import("pages/OrderHistory/orderHistory")),
    exact: true,
  },
  {
    path: SERVICE_REPORT,
    component: lazy(() => import("pages/ServiceReport/serviceReport")),
    exact: true,
  },
  {
    path: E_SIGNOFF,
    component: lazy(() => import("pages/E-SignOff/eSignOff")),
    exact: true,
  },
  {
    path: CHANGE_PASSWORD,
    component: lazy(() => import("pages/ChangePassword/changePassword")),
    exact: true,
  },
  {
    path: API_REPORT,
    component: lazy(() => import("pages/ApiReporting/apiReporting")),
    exact: true,
  },
  {
    path: AUDIT_LOGS,
    component: lazy(() => import("pages/AuditLogs/auditLogs")),
    exact: true,
  },
  {
    path: CMET,
    component: lazy(() => import("pages/CMET/cmet")),
    exact: true,
  },
  {
    path: SOC,
    component: lazy(() => import("pages/SOC/soc")),
    exact: true,
  },
  {
    path: SALES,
    component: lazy(() => import("pages/Sales/sales")),
    exact: true,
  },
  {
    path: GENERAL_FEEDBACK,
    component: lazy(() => import("pages/GeneralFeedback/generalFeedback")),
    exact: true,
  },
  {
    path: TRANSACTIONAL_FEEDBACK,
    component: lazy(() =>
      import("pages/TransactionalFeedback/transactionalFeedback")
    ),
    exact: true,
  },
  {
    path: PROFILE_INFO,
    component: lazy(() => import("pages/ProfileInfo/ProfileInfo")),
    exact: true,
  },
  {
    path: NPS_RATING,
    component: lazy(() => import("pages/NpsRating/NpsRating")),
    exact: true,
  },
  {
    path: NPS_RATING_REMIND_LETTER,
    component: lazy(() => import("pages/NpsRemindLetter/NpsRemindLetter")),
    exact: true,
  },
];
const AppRoutes = () => {
  return (
    <Switch>
      <React.Suspense fallback={<LoadingScreen />}>
        {ROUTES.map((route, index) => (
          <Route
            key={index}
            path={`${URL}${route.path}`}
            exact={route.exact}
            component={route.component}
          />
        ))}
      </React.Suspense>
    </Switch>
  );
};

export default AppRoutes;
