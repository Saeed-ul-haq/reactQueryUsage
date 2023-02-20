import { Layout } from "antd";
import { AppContext } from "context/globalContext";
import AppHeader from "layout/AppHeader";
import AppSidebar from "layout/AppSidebar";
import { useContext } from "react";
import "./style.css";
const { Content } = Layout;
const BaseLayout = ({ children }) => {
  const { globalState, logoutUser } = useContext(AppContext);

  return (
    <div className="app-main">
      <AppHeader globalState={globalState} logoutUser={logoutUser} />
      <Layout>
        <AppSidebar />
        <Content className="app-content">{children}</Content>
      </Layout>
    </div>
  );
};
export default BaseLayout;
