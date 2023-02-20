import { AppContext } from "context/globalContext";
import { Fragment, useContext, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import allReports from "services/bulkDownloadService";
import LoginReportsService from "services/loginReportService";
import { simpleSort } from "utils/GeneralHelper";

import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Typography,
} from "antd";
import DateRangePicker from "components/common/dateRangePicker";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { VIEW_LOGIN_REPORTS_USECASE } from "Settings/bulkDownloadUsecase";
const { Text } = Typography;

const csvHeader = [
  {
    label: "transaction_date",
    key: "transaction_Date",
  },
  {
    label: "msisdn",
    key: "msisdn",
  },
  {
    label: "transaction_time",
    key: "transaction_Time",
  },
  {
    label: "channel",
    key: "channel",
  },
  {
    label: "user_type",
    key: "userType",
  },
  {
    label: "jazzstatus",
    key: "status",
  },
  {
    label: "api_category",
    key: "apiCategory",
  },
  {
    label: "api_sub_category",
    key: "apiSubCategory",
  },
  {
    label: "jazz_api_name",
    key: "apiName",
  },
  {
    label: "api_url",
    key: "apiUrl",
  },
  {
    label: "jazz_api_response",
    key: "apiReponseCode",
  },
  {
    label: "jazz_api_exec_time",
    key: "execution_Time",
  },
];

const columns = [
  {
    title: "MSISDN",
    dataIndex: "msisdn",
    key: "msisdn",
  },
  {
    title: "Transaction Date",
    dataIndex: "transaction_Date",
    key: "transaction_Date",
  },

  {
    title: "Transaction Time",
    dataIndex: "transaction_Time",
    key: "transaction_Time",
    sorter: (a, b) => simpleSort(a, b, "transaction_Time"),
  },
  {
    title: "Channel",
    dataIndex: "channel",
    key: "channel",
    render: (value) => (value === "web" ? "Web" : value),
    sorter: (a, b) => a["channel"].length - b["channel"].length,
  },
  {
    title: "User Type",
    dataIndex: "userType",
    key: "userType",
    sorter: (a, b) => simpleSort(a, b, "userType"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: (a, b) => a["status"].length - b["status"].length,
  },
  {
    title: "API Category",
    dataIndex: "apiCategory",
    key: "apiCategory",
    sorter: (a, b) => a["apiCategory"].length - b["apiCategory"].length,
  },
  {
    title: "API Sub Category",
    dataIndex: "apiSubCategory",
    key: "apiSubCategory",
    sorter: (a, b) => a["apiSubCategory"].length - b["apiSubCategory"].length,
  },
  {
    title: "API Name",
    dataIndex: "apiName",
    key: "apiName",
    sorter: (a, b) => a["apiName"].length - b["apiName"].length,
  },
  {
    title: "API Url",
    dataIndex: "apiUrl",
    key: "apiUrl",
  },
  {
    title: "API Response Code",
    dataIndex: "apiReponseCode",
    key: "apiReponseCode",
    sorter: (a, b) => a["apiReponseCode"] - b["apiReponseCode"],
  },
  {
    title: "API Exec Time",
    dataIndex: "execution_Time",
    key: "execution_Time",
    sorter: {
      compare: (a, b) => a["execution_Time"] - b["execution_Time"],
      multiple: 2,
    },
  },
];

const API_STATUS_LIST = [
  { key: "All", displayValue: "All" },
  { key: "Success", displayValue: "Success" },
  { key: "Total Failure", displayValue: "Failure" },
  {
    key: "Failure-Pin not allowed",
    displayValue: "Failure-Pin not allowed",
  },
  {
    key: "Failure-Pin not matched",
    displayValue: "Failure-Pin not matched",
  },
  { key: "Failure-Pin expire", displayValue: "Failure-Pin expire" },
  {
    key: "Failure-Max attempt exceeed",
    displayValue: "Failure-Max attempt Exceed",
  },
  { key: "Failure-Pin not found", displayValue: "Failure-Pin not found" },
];

const USER_TYPE_LIST = [
  { key: "All", displayValue: "All" },
  { key: "spoc", displayValue: "SPOC" },
  { key: "line", displayValue: "LINE" },
  { key: "sec_spoc", displayValue: "Sec_SPOC" },
];

const CHANNEL_LIST = [
  { key: "All", displayValue: "All" },
  { key: "web", displayValue: "Web" },
];

const LoginReport = () => {
  const [loginReports, setLoginReports] = useState([]);
  const [recordCounts, setRecordCounts] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(9);
  const [isDateDisabled, setIsDateDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([
    new Date().toLocaleDateString("en-CA"),
    new Date().toLocaleDateString("en-CA"),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { globalState } = useContext(AppContext);

  const [form] = Form.useForm();
  const errorHandler = useErrorHandler();

  const getAllLoginReports = async (filters) => {
    try {
      setIsLoading(true);
      const data = await LoginReportsService.getAllReports(filters);
      setLoginReports(data.data);
      setRecordCounts(data.count);
      setRecordPerPage(data.recordPerPage);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      errorHandler(err);
    }
  };

  const getLoginReportsOnPageChange = async (filters) => {
    try {
      setIsLoading(true);
      const data = await LoginReportsService.getAllReports(filters);
      setLoginReports(data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      errorHandler(err);
    }
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    try {
      const formData = form.getFieldValue();
      let reportFilter = {
        data: {
          fromDate: isDateDisabled ? "" : dateRange[0],
          toDate: isDateDisabled ? "" : dateRange[1],
          msisdn: formData.msisdn,
          apiStatus: formData.apiStatus,
          userType: formData.userType,
          channel: formData.channel,
          isFilter: "false",
        },
        pageNumber: page,
      };
      getLoginReportsOnPageChange(reportFilter);
    } catch (err) {
      errorHandler(err);
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      msisdn: formData.msisdn,
      userType: formData.userType,
      channel: formData.channel,
      fromDate: isDateDisabled ? "" : dateRange[0],
      toDate: isDateDisabled ? "" : dateRange[1],
      apiStatus: formData.apiStatus,
      isFilter: false,
    };
    const headers = {
      useCase: VIEW_LOGIN_REPORTS_USECASE,
      userEmail: globalState?.userDetails?.email,
    };
    setIsLoading(true);
    const userData = await allReports(data, headers);
    console.log("userData >>>>>>>>>>>>>>>", userData);
    setIsLoading(false);
    if (userData.statusCode === 200) {
      message.success(userData?.message);
    }
  };

  return (
    <Fragment>
      <h3 className="mb-4">View Login Reports</h3>
      <Form
        labelCol={{ span: 30 }}
        wrapperCol={{ span: 30 }}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={(values) => {
          try {
            let reportFilter = {
              data: {
                fromDate: isDateDisabled ? "" : dateRange[0],
                toDate: isDateDisabled ? "" : dateRange[1],
                msisdn: values.msisdn,
                apiStatus: values.apiStatus,
                userType: values.userType,
                channel: values.channel,
                isFilter: "true",
              },
              pageNumber: 1,
            };
            setCurrentPage(1);
            getAllLoginReports(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
        initialValues={{
          allowDate: false,
          msisdn: "",
          apiStatus: "All",
          userType: "All",
          channel: "All",
        }}
      >
        <Row>
          <Col span={5}>
            <Form.Item
              rules={[
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Enter correct MSISDN!",
                },
              ]}
              label="Mobile Number"
              name="msisdn"
            >
              <Input
                autoComplete="off"
                maxLength={12}
                minLength={12}
                placeholder="92300xxxxxxx"
              />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item label="ESB API Status" name="apiStatus">
              <SelectDropdown items={API_STATUS_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item label="User Type" name="userType">
              <SelectDropdown items={USER_TYPE_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item label="Channel" name="channel">
              <SelectDropdown items={CHANNEL_LIST} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={3}>
            <Form.Item name="allowDate" valuePropName="checked" label=" ">
              <Checkbox onChange={(e) => setIsDateDisabled(!e.target.checked)}>
                Allow Date
              </Checkbox>
            </Form.Item>
          </Col>
          <Col className="ml-10" span={8}>
            <div className="datepicker-label">
              <span>From:</span>
              <span>To:</span>
            </div>
            <Form.Item name="dateRange">
              <DateRangePicker
                onChange={(_date, dateString) => {
                  setDateRange(dateString);
                }}
                disabled={isDateDisabled}
              />
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button disabled={!loginReports.length}>
                <CSVLink
                  filename={"LoginReport.csv"}
                  headers={csvHeader}
                  data={loginReports}
                >
                  Download Excel
                </CSVLink>
              </Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button onClick={downloadAllReports}>Download All</Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Text className="info-text">
                Total Login Count : {recordCounts}
              </Text>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ReportsViewTable
        dataSource={loginReports}
        columns={columns}
        scrollValue={2000}
        loading={isLoading}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        defaultPageSize={recordPerPage}
        totalRecordCount={recordCounts}
      />
    </Fragment>
  );
};
export default LoginReport;
