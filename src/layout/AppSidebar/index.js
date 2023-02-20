import { Layout, Menu } from "antd";
import { AppContext } from "context/globalContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  ADD_USER,
  API_REPORT,
  BILLING_REPORT,
  BULK_REPORT,
  CHANGE_PASSWORD,
  E_SIGNOFF,
  GENERAL_FEEDBACK,
  LOGIN_REPORT,
  NPS_RATING,
  NPS_RATING_REMIND_LETTER,
  ORDER_HISTORY,
  PROFILE_INFO,
  SERVICE_REPORT,
  TRANSACTIONAL_FEEDBACK,
  URL,
  USERS,
  USER_REPORT,
} from "Settings/constant";
import "./style.css";
const { SubMenu } = Menu;
const { Sider } = Layout;
const AppSidebar = () => {
  const { globalState } = useContext(AppContext);

  const userRoles = globalState.userDetails.userRoles
    ? globalState.userDetails.userRoles
    : [];
  let feedbackRolesIds = [9, 4, 22, 23];
  let manangeUserId = [6, 9];

  const sortedUserRoles =
    userRoles &&
    userRoles.sort(function (a, b) {
      return a.order_by - b.order_by;
    });
  return (
    <div className="left-navigation-bar">
      <Sider width={220} className="site-layout-background">
        <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
          {/* NEW */}

          {sortedUserRoles &&
            userRoles.map((role) => {
              return (
                <>
                  {!role.parentName ? (
                    <Menu.Item key={role.id}>
                      <Link
                        to={
                          role.usecase_url_name
                            ? `${URL}${role.usecase_url_name}`
                            : `${URL}`
                        }
                      >
                        {role.name}
                      </Link>
                    </Menu.Item>
                  ) : (
                    <>
                      {role.subPrivilege && (
                        <SubMenu key={role.parentName} title={role.parentName}>
                          {role.subPrivilege.map((child) => {
                            return (
                              <Menu.Item key={child.id}>
                                <Link to={`${URL}${child.usecase_url_name}`}>
                                  {" "}
                                  {child.name}
                                </Link>
                              </Menu.Item>
                            );
                          })}
                        </SubMenu>
                      )}
                    </>
                  )}{" "}
                </>
              );
            })}

          {/* OLD */}
          {/* {userRoles.findIndex((elem) => elem.id === 7) > -1 && (
            <Menu.Item key="1">
              <Link to={`${URL}${LOGIN_REPORT}`}>View Login Reports</Link>
            </Menu.Item>
          )}

          {userRoles.findIndex((elem) => elem.id === 17) > -1 && (
            <Menu.Item key="2">
              <Link to={`${URL}${BILLING_REPORT}`}> Billing Report</Link>
            </Menu.Item>
          )}
          {userRoles.findIndex((elem) => elem.id === 17) > -1 && (
            <Menu.Item key="3">
              <Link to={`${URL}${USER_REPORT}`}> View User Reports</Link>
            </Menu.Item>
          )}
          {userRoles.some((elem) => manangeUserId.includes(elem.id)) && (
            <SubMenu key="sub1" title="Manage Users">
              {userRoles.findIndex((elem) => elem.id === 6) > -1 && (
                <Menu.Item key={USERS}>
                  <Link to={`${URL}${USERS}`}> View/Edit Users</Link>
                </Menu.Item>
              )}

              {userRoles.findIndex((elem) => elem.id === 19) > -1 && (
                <Menu.Item key={ADD_USER}>
                  <Link to={`${URL}${ADD_USER}`}> Add New User</Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}
          {userRoles.some((elem) => feedbackRolesIds.includes(elem.id)) && (
            <SubMenu key={"Feedback"} title="Feedback">
              {userRoles.findIndex((elem) => elem.id === 9) > -1 && (
                <Menu.Item key={GENERAL_FEEDBACK}>
                  <Link to={`${URL}${GENERAL_FEEDBACK}`}>General Feedback</Link>
                </Menu.Item>
              )}
              {userRoles.findIndex((elem) => elem.id === 4) > -1 && (
                <Menu.Item key={TRANSACTIONAL_FEEDBACK}>
                  <Link to={`${URL}${TRANSACTIONAL_FEEDBACK}`}>
                    Transactional Feedback
                  </Link>
                </Menu.Item>
              )}
              {userRoles.findIndex((elem) => elem.id === 22) > -1 && (
                <Menu.Item key={NPS_RATING}>
                  <Link to={`${URL}${NPS_RATING}`}>NPS Rating</Link>
                </Menu.Item>
              )}
              {userRoles.findIndex((elem) => elem.id === 23) > -1 && (
                <Menu.Item key={20}>
                  <Link to={`${URL}${NPS_RATING_REMIND_LETTER}`}>
                    NPS Remind me Letter
                  </Link>
                </Menu.Item>
              )}
            </SubMenu>
          )}

          {userRoles.findIndex((elem) => elem.id === 1) > -1 && (
            <Menu.Item key="4">
              <Link to={`${URL}${BULK_REPORT}`}>Bulk Download Report</Link>
            </Menu.Item>
          )}

          {userRoles.findIndex((elem) => elem.id === 8) > -1 && (
            <Menu.Item key="5">
              <Link to={`${URL}${ORDER_HISTORY}`}>Order History</Link>
            </Menu.Item>
          )}

          {userRoles.findIndex((elem) => elem.id === 11) > -1 && (
            <Menu.Item key="6">
              <Link to={`${URL}${SERVICE_REPORT}`}> Service Report</Link>
            </Menu.Item>
          )}
          {userRoles.findIndex((elem) => elem.id === 12) > -1 && (
            <Menu.Item key="7">
              <Link to={`${URL}${E_SIGNOFF}`}> E-Sign Off</Link>
            </Menu.Item>
          )}

          {userRoles.findIndex((elem) => elem.id === 15) > -1 && (
            <Menu.Item key="8">
              <Link to={`${URL}${CHANGE_PASSWORD}`}>Change Password</Link>
            </Menu.Item>
          )}

          {userRoles.findIndex((elem) => elem.id === 13) > -1 && (
            <Menu.Item key="9">
              <Link to={`${URL}${API_REPORT}`}>API Reporting</Link>
            </Menu.Item>
          )} */}
          {/* {userRoles.findIndex((elem) => elem.id === 10) > -1 && (
                  <Menu.Item
                    key="10"
                    onClick={() => history.push("/jazz/audit-logs")}
                  >
                    Audit Logs
                  </Menu.Item>
                )}
                {userRoles.findIndex((elem) => elem.id === 14) > -1 && (
                  <Menu.Item
                    key="11"
                    onClick={() => history.push("/jazz/cmet")}
                  >
                    CMET
                  </Menu.Item>
                )}
                {userRoles.findIndex((elem) => elem.id === 16) > -1 && (
                  <Menu.Item key="12" onClick={() => history.push("/jazz/soc")}>
                    SOC
                  </Menu.Item>
                )}

                {userRoles.findIndex((elem) => elem.id === 18) > -1 && (
                  <Menu.Item
                    key="13"
                    onClick={() => history.push("/jazz/sales")}
                  >
                    Sales Status
                  </Menu.Item>
                )} */}
          {/* {userRoles.findIndex((elem) => elem.id === 14) > -1 && (
            <Menu.Item key="16">
              <Link to={`${URL}${PROFILE_INFO}`}>Profile Info</Link>
            </Menu.Item>
          )} */}
        </Menu>
      </Sider>
    </div>
  );
};
export default AppSidebar;
