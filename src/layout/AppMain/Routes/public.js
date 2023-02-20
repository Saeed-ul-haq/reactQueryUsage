import { lazy } from "react";
import { LOGIN } from "Settings/constant";


export const publicRoutes = [
  {
    path: LOGIN,
    component: lazy(() => import("pages/Login/login")),
    exact: true,
  },
];
