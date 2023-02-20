import React from "react";
import { Layout, Button } from "antd";
import JazzLogo from "assets/images/JazzLogo.png";
import "./style.css";
const { Header } = Layout;

export default function AppHeader({ globalState, logoutUser }) {
  return (
    <Header className="header">
      <img src={JazzLogo} style={{ height: "55px" }} alt="logo" />
      <span className="user-email me-auto">
        Hi, {globalState.userDetails && globalState.userDetails.email}
      </span>
      <span>
        <Button onClick={() => logoutUser()} className="ml-auto">
          Logout
        </Button>
      </span>
    </Header>
  );
}
