import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import JazzLogo from "assets/images/JazzLogo.png";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 84, color: "#edb801" }} spin />
);

const LoadingScreen = () => {
  return (
    <div className="fallback-view">
      <div className="loader-div">
        <Spin
          style={{
            position: "relative",
            left: -32,
          }}
          indicator={antIcon}
          spinning={true}
        >
          <img src={JazzLogo} style={{ height: "55px" }} alt="logo" />
        </Spin>
      </div>
    </div>
  );
};

export default LoadingScreen;
