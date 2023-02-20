import { Button, Col, DatePicker, Form, message, Row } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { Fragment, useContext, useEffect, useState } from "react";
import allReports from "services/bulkDownloadService";

import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import UserTypeServices from "services/userTypeService";
import { VIEW_USER_REPORTS_USECASE } from "Settings/bulkDownloadUsecase";
const { RangePicker } = DatePicker;
const REGISTERED_USERS_COLUMNS = [
  {
    title: "Entity Id",
    dataIndex: "entityId",
    key: "entityId",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "User Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Msisdn",
    dataIndex: "msisdn",
    key: "msisdn",
    render: (text) => (text === "undefined" ? "" : text),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Reference Id",
    dataIndex: "referenceId",
    key: "referenceId",
  },
];

const USER_STATUS_COLUMNS = [
  {
    title: "MSISDN",
    dataIndex: "msisdn",
    key: "msisdn",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a["status"].length - b["status"].length,
  },
];

const ACTIVE_COLUMN = [
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
  },
  {
    title: "MSISDN",
    dataIndex: "msisdn",
    key: "msisdn",
  },
];
const MSISDN_COLUMN = [
  {
    title: "MSISDN",
    dataIndex: "msisdn",
    key: "msisdn",
  },
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
  },
];

const USER_TYPE_LIST = [
  { key: "SPOC", displayValue: "SPOC" },
  { key: "LINE", displayValue: "LINE" },
  { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
];

const MENU_ITEMS_LIST = [
  { key: "Total Registered Users", displayValue: "Total Registered Users" },
  { key: "Daily Active Users", displayValue: "Daily Active Users" },
  { key: "Weekly Active Users", displayValue: "Weekly Active Users" },
  { key: "Monthly Active Users", displayValue: "Monthly Active Users" },
  // { key: "Average Revenue Per User", displayValue: "Average Revenue Per User" },
  { key: "Total logins", displayValue: "Total logins" },
  { key: "User types", displayValue: "User types" },
  { key: "User status", displayValue: "User status" },
];

const UserReport = () => {
  const [currentView, setCurrentView] = useState("Total Registered Users");
  const [dateRange, setDateRange] = useState([]);
  const [recordPerPage, setrecordPerPage] = useState(9);
  const [userRecord, setUserRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyActiveDate, setdailyActiveDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { globalState } = useContext(AppContext);

  const errorHandler = useErrorHandler();
  const [selectedColumn, setSelectedColumn] = useState(
    REGISTERED_USERS_COLUMNS
  );
  const [totalRegisteredUser, setTotalRegisteredUser] = useState(0);
  useEffect(() => {
    switch (currentView) {
      case "Total Registered Users":
        setSelectedColumn(REGISTERED_USERS_COLUMNS);
        break;
      case "User status":
        setSelectedColumn(USER_STATUS_COLUMNS);
        break;
      case "User types":
        setSelectedColumn(MSISDN_COLUMN);
        break;
      default:
        setSelectedColumn(ACTIVE_COLUMN);
    }
  }, [currentView]);

  const getUserReports = async (filters) => {
    // check Date Range
    if (
      currentView === "Weekly Active Users" ||
      currentView === "Total Registered Users" ||
      currentView === "Total logins"
    ) {
      if (!dateRange || !dateRange[0] || !dateRange[1]) {
        message.warning("Please select From and To date First!");
        return;
      }
      if (
        dateRange &&
        (moment(dateRange[0]) > moment.now() ||
          moment(dateRange[1]) > moment.now())
      ) {
        message.warning("Cannot select Future Date!");
        return;
      }
    }

    // check Start Date only
    if (
      currentView === "Daily Active Users" ||
      currentView === "Monthly Active Users"
    ) {
      if (!dailyActiveDate) {
        message.warning("Please select date First!");
        return;
      }

      if (moment(dailyActiveDate) > moment.now()) {
        message.warning("Cannot select Future Date!");
        return;
      }
    }

    const url =
      filters.data.selectedmenu === "Total Registered Users"
        ? "/userReportController/viewUserReportsForTotalReg?pageNumber="
        : "/userReportController/viewUserReports?pageNumber=";
    try {
      setLoading(true);
      const data = await UserTypeServices.getUserType(url, filters);

      setUserRecord(data?.data);
      setrecordPerPage(data?.recordPerPage);
      setTotalRegisteredUser(data?.count);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      errorHandler(err);
    }
  };
  const getUserPaginatedRecord = async (filters) => {
    const url =
      filters.data.selectedmenu === "Total Registered Users"
        ? "/userReportController/viewUserReportsForTotalReg?pageNumber="
        : "/userReportController/viewUserReports?pageNumber=";
    try {
      setLoading(true);
      const data = await UserTypeServices.getUserType(url, filters);
      setUserRecord(data?.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      errorHandler(err);
    }
  };
  const onPaginationChange = (page) => {
    const formData = form.getFieldValue();
    setCurrentPage(page);
    var filters = {};
    if (currentView === "Daily Active Users") {
      filters = {
        data: {
          userType: formData.userType,
          selectedmenu: formData.selectedmenu,
          fromDate: dailyActiveDate,
          isFilter: true,
        },
        pageNumber: page,
      };
    } else {
      filters = {
        data: {
          userType: formData.userType,
          selectedmenu: formData.selectedmenu,
          fromDate: dateRange[0],
          toDate: dateRange[1],
          isFilter: true,
        },
        pageNumber: page,
      };
    }
    try {
      getUserPaginatedRecord(filters);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getPaginationValue = () => {
    switch (currentView) {
      case "Total Registered Users":
        return false;
      case "Daily Active Users":
      case "Weekly Active Users":
      case "Monthly Active Users":
        return true;

      case "Total logins":
        return true;
      default:
        return false;
    }
  };
  const headers = selectedColumn.map((col) => {
    return { key: col.key, label: col.title };
  });
  const dateFormat = "YYYY-MM-DD";
  const downloadAllReports = async () => {
    const formData = form.getFieldValue();
    console.log(formData);
    const data = {
      msisdn: formData.msisdn,
      selectedmenu: formData.selectedmenu,
    };
    if (
      currentView === "Total Registered Users" ||
      currentView === "Weekly Active Users" ||
      currentView === "Total logins"
    ) {
      data.fromDate = dateRange[0] ? dateRange[0] : "";
      data.toDate = dateRange[1] ? dateRange[1] : "";
    }
    if (currentView === "Daily Active Users") {
      data.fromDate = dailyActiveDate;
    }
    if (currentView === "Monthly Active Users") {
      data.fromDate = new Date(formData.monthlyDate).toLocaleDateString(
        "en-CA"
      );
    }
    const headers = {
      useCase: VIEW_USER_REPORTS_USECASE,
      userEmail: globalState?.userDetails?.email,
    };
    const userData = await allReports(data, headers);
    setLoading(true);
    console.log("userData >>>>>>>>>>>>>>>", userData);
    setLoading(false);
    if (userData.statusCode === 200) {
      message.success(userData?.message);
    }
  };
  return (
    <Fragment>
      <h3 className="mb-4">User Reports</h3>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          userType: [],
          selectedmenu: "Total Registered Users",
          toDate: "",
          fromDate: "",
          monthlyDate: "",
          // dateRange: currentView === "Daily Active Users" && moment(new Date,dateFormat)
        }}
        onFinish={(values) => {
          const filters = {
            data: {
              userType: values.userType,
              selectedmenu: values.selectedmenu,
              isFilter: true,
            },
            pageNumber: 1,
          };

          if (
            currentView === "Total Registered Users" ||
            currentView === "Weekly Active Users" ||
            currentView === "Total logins"
          ) {
            filters.data.fromDate = dateRange[0] ? dateRange[0] : "";
            filters.data.toDate = dateRange[1] ? dateRange[1] : "";
          }

          if (currentView === "Daily Active Users") {
            filters.data.fromDate = dailyActiveDate;
          }
          if (currentView === "Monthly Active Users") {
            filters.data.fromDate = new Date(
              values.monthlyDate
            ).toLocaleDateString("en-CA");
          }
          setCurrentPage(1);
          getUserReports(filters);
        }}
      >
        <Row>
          <Col span={4}>
            <Form.Item name="userType" label="User Type">
              <SelectDropdown
                items={USER_TYPE_LIST}
                placeholder="Select Usecase"
                mode="multiple"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item className="ml-10" name="selectedmenu" label="Menu Items">
              <SelectDropdown
                items={MENU_ITEMS_LIST}
                onChange={(value) => {
                  setCurrentView(value);
                  setTotalRegisteredUser(0);
                  setUserRecord([]);
                }}
              />
            </Form.Item>
          </Col>

          {currentView === "Daily Active Users" && (
            <Col>
              <Form.Item
                className="ml-10 standard-dropdown-width "
                label="Select Date"
                name="dailyActiveDate"
              >
                <DatePicker
                  defaultValue={moment(new Date(), dateFormat)}
                  format={dateFormat}
                  onChange={(_date, dateString) => {
                    setdailyActiveDate(dateString);
                  }}
                  disabledDate={(current) => {
                    return current && current > moment().endOf("day");
                  }}
                />
              </Form.Item>
            </Col>
          )}

          {(currentView === "Weekly Active Users" ||
            currentView === "Total Registered Users" ||
            currentView === "Total logins") && (
            <>
              <Col className="ml-10">
                <div className="datepicker-label">
                  <span>From:</span>
                  <span>To:</span>
                </div>
                <Form.Item name="dateRange">
                  <RangePicker
                    onChange={(_date, dateString) => {
                      console.log(dateString);
                      setDateRange(dateString);
                    }}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {currentView === "Monthly Active Users" && (
            <Col>
              <Form.Item
                name="monthlyDate"
                className="ml-10"
                label="Select Month and Year"
              >
                <DatePicker />
              </Form.Item>
            </Col>
          )}
          <Col>
            <Form.Item className="ml-10" label=" ">
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label=" " className="ml-10">
              <Button
                title="download"
                disabled={totalRegisteredUser > 0 ? false : true}
              >
                <CSVLink
                  filename="View User Reports"
                  data={userRecord || []}
                  headers={headers}
                >
                  Download
                </CSVLink>
              </Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button onClick={downloadAllReports}>Download All</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <h6 className="mt-3">
        {currentView} : {totalRegisteredUser}
      </h6>

      <ReportsViewTable
        scrollValue={1000}
        scrollY={400}
        loading={loading}
        dataSource={userRecord}
        isPagination={getPaginationValue()}
        currentPage={currentPage}
        columns={selectedColumn}
        onPaginationChange={(page) => onPaginationChange(page)}
        showQuickJumper={true}
        defaultPageSize={recordPerPage}
        totalRecordCount={totalRegisteredUser}
      />
    </Fragment>
  );
};
export default UserReport;
