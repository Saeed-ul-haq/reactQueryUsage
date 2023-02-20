import { Button, Col, Form, message, Row } from "antd";
import DateRangePicker from "components/common/dateRangePicker";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import { Fragment, useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import apiReportingService from "services/apiReportingService";
import allReports from "services/bulkDownloadService";
import getUsecases from "services/useCaseService";
import { SERVICE_REPORT_USECASE } from "Settings/bulkDownloadUsecase";
import { simpleSort } from "utils/GeneralHelper";

const STATUS_LIST = [
  { key: "All", displayValue: "All" },
  { key: "success", displayValue: "Success" },
  { key: "failure", displayValue: "Failure" },
];

const USER_TYPE_LIST = [
  { key: "SPOC", displayValue: "SPOC" },
  { key: "LINE", displayValue: "LINE" },
  { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
];

const columns = [
  // {
  //   dataIndex: "serial",
  //   key: "serial",
  //   title: "Serial",
  // },
  {
    dataIndex: "transaction_date",
    key: "transaction_date",
    title: "Transaction Date",
  },
  {
    dataIndex: "transaction_time",
    key: "transaction_time",
    title: "Transaction Time",
    sorter: (a, b) => simpleSort(a, b, "transaction_time"),
  },
  {
    dataIndex: "msisdn",
    key: "msisdn",
    title: "Msisdn",
  },
  {
    dataIndex: "poc_msisdn",
    key: "poc_msisdn",
    title: "Poc Msisdn",
  },
  {
    dataIndex: "api_response_code",
    key: "api_response_code",
    title: "API Respone Code",
    sorter: (a, b) => simpleSort(a, b, "transaction_time"),
  },
  {
    dataIndex: "api_name",
    key: "api_name",
    title: "API Name",
    sorter: (a, b) => a["api_name"].length - b["api_name"].length,
  },
  {
    dataIndex: "api_category",
    key: "api_category",
    title: "API Category",
    sorter: (a, b) => a["api_category"].length - b["api_category"].length,
  },
  {
    dataIndex: "api_sub_category",
    key: "api_sub_category",
    title: "API Sub Category",
    sorter: (a, b) =>
      a["api_sub_category"].length - b["api_sub_category"].length,
  },
  {
    dataIndex: "api_url",
    key: "api_url",
    title: "API URL",
  },
  {
    dataIndex: "errormessage",
    key: "erormessage",
    title: "Error Message",
  },

  // {
  //   dataIndex: "jazz_exec_time",
  //   key: "jazz_exec_time",
  //   title: "JAZZ API Exec Time",
  // },
  // {
  //   dataIndex: "api_exec_time",
  //   key: "api_exec_time",
  //   title: "API Exec Time",
  // },
  // {
  //   dataIndex: "jazz_api_name",
  //   key: "jazz_api_name",
  //   title: "JAZZ API Name",
  //   sorter: (a, b) => a["jazz_api_name"].length - b["jazz_api_name"].length,
  // },
  // {
  //   dataIndex: "api_request",
  //   key: "api_request",
  //   title: "JAZZ API Request",
  // },
  // {
  //   dataIndex: "api_response",
  //   key: "api_response",
  //   title: "JAZZ API Response",
  // },
];

const headers = columns.map((col) => {
  return {
    key: col.key,
    label: col.title,
  };
});

const ServiceReporting = () => {
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiList, setapiList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([
    new Date().toLocaleDateString("en-CA"),
    new Date().toLocaleDateString("en-CA"),
  ]);
  const { globalState } = useContext(AppContext);

  const getApiReportsData = async (filters) => {
    try {
      setLoading(true);
      const data = await apiReportingService.getApiReports(filters);
      setDataSource({
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      errorHandler(err);
    }
  };

  useEffect(() => {
    getApiNames();
  }, []);

  const getApiNames = async () => {
    setLoading(true);
    const { data = [] } = (await getUsecases("service_report")) || [];

    const dataNames = (data || []).map((item = "") => {
      return { key: item, displayValue: item };
    });
    setapiList(dataNames);
    setLoading(false);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    const formData = form.getFieldValue();
    const filters = {
      data: {
        apiName: formData.apiName,
        apistatus: formData.status,
        jazzApiStatus: formData.jazzApiStatus,
        fromDate: dateRange[0] ? dateRange[0] : "",
        toDate: dateRange[1] ? dateRange[1] : "",
      },
      pageNumber: page,
    };
    getApiReportsData(filters);
  };
  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      apistatus: formData.status,
      jazzApiStatus: formData.jazzApiStatus,
      apiName: formData.apiName,
      fromDate: dateRange[0] ? dateRange[0] : "",
      toDate: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: SERVICE_REPORT_USECASE,
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
      <h3 className="mb-4">Service Reporting</h3>
      <Form
        form={form}
        initialValues={{
          apiName: "All",
          status: "All",
          jazzApiStatus: "All",
          userType: "All",
        }}
        onFinish={(values) => {
          setCurrentPage(1);
          const filters = {
            data: {
              apiName: values.apiName,
              apistatus: values.status,
              jazzApiStatus: values.jazzApiStatus,
              fromDate: dateRange[0] ? dateRange[0] : "",
              toDate: dateRange[1] ? dateRange[1] : "",
            },
            pageNumber: 1,
          };
          getApiReportsData(filters);
        }}
        layout="vertical"
      >
        <Row>
          <Col span={5}>
            <Form.Item name="apiName" label="API's Name">
              <SelectDropdown items={apiList} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={2}>
            <Form.Item name="status" label="Status">
              <SelectDropdown items={STATUS_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={3}>
            <Form.Item name="userType" label="User Type">
              <SelectDropdown items={USER_TYPE_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <div className="datepicker-label">
              <span>From:</span>
              <span>To:</span>
            </div>
            <Form.Item name="dateRange">
              <DateRangePicker
                onChange={(_date, dateString) => {
                  setDateRange(dateString);
                }}
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
              <Button disabled={!dataSource?.list?.length}>
                <CSVLink
                  filename="Serviec Reports"
                  data={dataSource.list || []}
                  headers={headers}
                >
                  download
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

      <ReportsViewTable
        dataSource={dataSource.list}
        scrollValue={2500}
        columns={columns}
        loading={loading}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
      />
    </Fragment>
  );
};
export default ServiceReporting;
