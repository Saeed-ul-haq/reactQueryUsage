import React from "react";
import { Row, Col, Layout } from "antd";
const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="mt-5 appFooter">
      <Row justify="center">
        <Col span={12}>
          <b>Copyright Jazz</b>

          <b> - {new Date().getFullYear()}</b>
        </Col>
        <Col span={6}>
          <b>Privacy Statement</b>
        </Col>
      </Row>
    </Footer>
  );
};
export default AppFooter;
