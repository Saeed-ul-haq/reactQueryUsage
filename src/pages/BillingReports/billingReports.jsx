import { Button, Col, Form, Input, message, Row } from "antd";
import DateRangePicker from "components/common/dateRangePicker";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import { Fragment, useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import BillingReportService from "services/billingReportService";
import allReports from "services/bulkDownloadService";
import {
  BILLING_REPORT_AVERAGE_PAYMENT_USECASE,
  BILLING_REPORT_PAYMENT_AGAINST_LINES_USECASE,
  BILLING_REPORT_TOTAL_INITIATED_USECASE,
} from "Settings/bulkDownloadUsecase";

const TOTAL_INITIATED_COLUMNS = [
  // {
  //   title: "Serial",
  //   dataIndex: "id",
  //   key: "id",
  // },
  {
    title: "Created Date",
    dataIndex: "created_date",
    key: "created_date",
  },
  {
    title: "Spoc MSISDN",
    dataIndex: "spoc_msisdn",
    key: "spoc_msisdn",
  },
  {
    title: "Transaction Id",
    dataIndex: "payment_trx_id",
    key: "payment_trx_id",
    sorter: {
      compare: (a, b) => a["payment_trx_id"] - b["payment_trx_id"],
      multiple: 2,
    },
  },
  {
    title: "Line Posting Status",
    dataIndex: "line_Posting_status",
    key: "line_Posting_status",
    sorter: (a, b) =>
      a["line_Posting_status"].length - b["line_Posting_status"].length,
  },
  {
    title: "Method Type",
    dataIndex: "method_type",
    key: "method_type",
    sorter: (a, b) => a["method_type"].length - b["method_type"].length,
  },

  {
    title: "Amount",
    dataIndex: "total_amount",
    key: "total_amount",
    sorter: {
      compare: (a, b) => a["total_amount"] - b["total_amount"],
      multiple: 2,
    },
  },
  {
    title: "Payment Initiated Date",
    dataIndex: "payment_initiated_date",
    key: "payment_initiated_date",
  },

  {
    title: "Payment Deduction Date",
    dataIndex: "payment_deduction_date",
    key: "payment_deduction_date",
  },
];

const AVERAGE_PAYMENT_COLUMNS = [
  {
    title: "Serial",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Created Date",
    dataIndex: "created_date",
    key: "created_date",
  },
  {
    title: "Spoc MSISDN",
    dataIndex: "spoc_msisdn",
    key: "spoc_msisdn",
  },
  {
    title: "Method Type",
    dataIndex: "method_type",
    key: "method_type",
    sorter: (a, b) => a["method_type"].length - b["method_type"].length,
  },
  {
    title: "Total Amount Average",
    dataIndex: "total_amount",
    key: "total_amount",
    sorter: {
      compare: (a, b) => a["total_amount"] - b["total_amount"],
      multiple: 2,
    },
  },
];

const PAYMENT_LINES_COLUMNS = [
  {
    title: "Serial",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Created Date",
    dataIndex: "created_date",
    key: "created_date",
  },
  {
    title: "Spoc MSISDN",
    dataIndex: "spoc_msisdn",
    key: "spoc_msisdn",
  },
  {
    title: "Line MSISDN",
    dataIndex: "line_msisdn",
    key: "line_msisdn",
  },
  {
    title: "Line Transaction Id",
    dataIndex: "line_transaction_id",
    key: "line_transaction_id",
  },
  {
    title: "Payment Method",
    dataIndex: "method_type",
    key: "method_type",
    sorter: (a, b) => a["method_type"].length - b["method_type"].length,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    sorter: (a, b) => a["amount"] - b["amount"],
  },
  {
    title: "Bill Posting Status",
    dataIndex: "bill_posting_status",
    key: "bill_posting_status",
    sorter: (a, b) =>
      a["bill_posting_status"].length - b["bill_posting_status"].length,
  },

  {
    title: "Payment Initiated Date",
    dataIndex: "payment_initiated_date",
    key: "initiated_date",
  },

  {
    title: "Payment Deduction Date",
    dataIndex: "payment_deduction_date",
    key: "payment_deduction_date",
  },
  {
    title: "Bill Posting Date",
    dataIndex: "bill_posting_date",
    key: "bill_posting_date",
  },
  {
    title: "Receipt Number",
    dataIndex: "receipt_number",
    key: "receipt_number",
  },
];

const MENU_ITEMS_LIST = [
  { key: "Total Initiated", displayValue: "Total Initiated" },
  { key: "Average Payment", displayValue: "Average Payment" },
  { key: "Payments Against Lines", displayValue: "Payments Against Lines" },
];

const POST_STATUS_LIST = [
  { key: "All", displayValue: "All" },
  { key: "Success", displayValue: "Success" },
  { key: "Pending", displayValue: "Pending" },
  { key: "Failure", displayValue: "Failure" },
];

const BILLLING_METHOD_LISTS = [
  { key: "All", displayValue: "All" },
  { key: "Credit Card", displayValue: "Credit Card" },
  { key: "Jazz Cash", displayValue: "Jazz Cash" },
  { key: "Cheque", displayValue: "Others" },
];

const USER_TYPE = [
  { key: "All", displayValue: "All" },
  { key: "SPOC", displayValue: "SPOC" },
  { key: "Line", displayValue: "LINE" },
  { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
];

const BillingReports = () => {
  const [billingReports, setBillingReports] = useState({
    recordCount: 0,
    averagePayment: 0,
  });
  const [currentReport, setCurrentReport] = useState("Total Initiated");
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([
    new Date().toLocaleDateString("en-CA"),
    new Date().toLocaleDateString("en-CA"),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [columnData, setColumnData] = useState({
    column: [],
    scrollValue: 1600,
  });

  const { globalState } = useContext(AppContext);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    if (billingReports.list && billingReports.list.length > 0) {
      setBillingReports({});
    }
    if (currentReport === "Total Initiated") {
      setColumnData({ column: TOTAL_INITIATED_COLUMNS, scrollValue: 1600 });
    } else if (currentReport === "Average Payment") {
      setColumnData({ column: AVERAGE_PAYMENT_COLUMNS, scrollValue: 800 });
    } else if (currentReport === "Payments Against Lines") {
      setColumnData({ column: PAYMENT_LINES_COLUMNS, scrollValue: 1800 });
    }
    // eslint-disable-next-line
  }, [currentReport]);

  const getAllBillingReports = async (filters) => {
    try {
      setIsLoading(true);
      const data = await BillingReportService.getAllBillingReports(filters);
      setBillingReports({
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
        averagePayment: data.average ? data.average : 0,
      });
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
          postingStatus: formData.postingStatus,
          userType: formData.userType,
          msisdn: formData.msisdn,
          dateFrom: dateRange[0] ? dateRange[0] : "",
          dateTo: dateRange[1] ? dateRange[1] : "",
          billingMethod: formData.billingMethod,
          menuItem: formData.menuItem,
        },
        pageNumber: page,
      };

      if (
        currentReport !== "Average Payment" &&
        formData.transactionId !== ""
      ) {
        reportFilter.data.transactionId = formData.transactionId;
      }

      getAllBillingReports(reportFilter);
    } catch (err) {
      errorHandler(err);
    }
  };

  const getPaymentLable = () => {
    switch (currentReport) {
      case "Total Initiated":
        return "Total Initiated : ";
      case "Average Payment":
        return "Average Payment : ";
      case "Payments Against Lines":
        return "Total Payments : ";
      default:
        return "Total Initiated";
    }
  };
  const getDownloadUseCase = () => {
    switch (currentReport) {
      case "Total Initiated":
        return BILLING_REPORT_TOTAL_INITIATED_USECASE;
      case "Average Payment":
        return BILLING_REPORT_AVERAGE_PAYMENT_USECASE;
      case "Payments Against Lines":
        return BILLING_REPORT_PAYMENT_AGAINST_LINES_USECASE;
      default:
        return BILLING_REPORT_TOTAL_INITIATED_USECASE;
    }
  };

  const getHeader = () => {
    if (currentReport === "Total Initiated") {
      return TOTAL_INITIATED_COLUMNS.map((item) => {
        return { key: item.key, label: item.title };
      });
    } else if (currentReport === "Average Payment") {
      return AVERAGE_PAYMENT_COLUMNS.map((item) => {
        return { key: item.key, label: item.title };
      });
    } else if (currentReport === "Payments Against Lines") {
      return PAYMENT_LINES_COLUMNS.map((item) => {
        return { key: item.key, label: item.title };
      });
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      menuItem: formData.menuItem,
      postingStatus: formData.postingStatus,
      billingMethod: formData.billingMethod,
      userType: formData.userType,
      msisdn: formData.msisdn,
      fromDate: dateRange[0] ? dateRange[0] : "",
      toDate: dateRange[1] ? dateRange[1] : "",
    };
    if (currentReport !== "Average Payment" && formData.transactionId !== "") {
      data.transactionId =
        currentReport === "Total Initiated"
          ? parseInt(formData.transactionId)
          : formData.transactionId;
    }
    const headers = {
      useCase: getDownloadUseCase(),
      userEmail: globalState?.userDetails?.email,
    };
    const userData = await allReports(data, headers);
    setIsLoading(true);
    console.log("userData >>>>>>>>>>>>>>>", userData);
    setIsLoading(false);
    if (userData.statusCode === 200) {
      message.success(userData?.message);
    }
  };
  return (
    <Fragment>
      <h3 className="mb-4">Billing Reports</h3>
      <Form
        form={form}
        onFinish={(values) => {
          try {
            let reportFilter = {
              data: {
                menuItem: values.menuItem,
                postingStatus: values.postingStatus,
                billingMethod: values.billingMethod,
                userType: values.userType,
                msisdn: values.msisdn,
                fromDate: dateRange[0] ? dateRange[0] : "",
                toDate: dateRange[1] ? dateRange[1] : "",
              },
              pageNumber: 1,
            };

            if (
              currentReport !== "Average Payment" &&
              values.transactionId !== ""
            ) {
              reportFilter.data.transactionId =
                currentReport === "Total Initiated"
                  ? parseInt(values.transactionId)
                  : values.transactionId;
            }
            setCurrentPage(1);
            getAllBillingReports(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
        initialValues={{
          menuItem: "Total Initiated",
          postingStatus: "All",
          billingMethod: "All",
          userType: "All",
          fromDate: "",
          toDate: "",
          msisdn: "",
          transactionId: "",
        }}
        layout="vertical"
      >
        <Row align="middle">
          <Col span={5}>
            <Form.Item name="menuItem" label="Menu Items">
              <SelectDropdown
                onChange={(value) => setCurrentReport(value)}
                items={MENU_ITEMS_LIST}
              />
            </Form.Item>
          </Col>
          {currentReport !== "" && (
            <>
              <Col>
                <Form.Item
                  className="ml-10 standard-dropdown-width"
                  name="postingStatus"
                  label="Line Posting Status"
                >
                  <SelectDropdown items={POST_STATUS_LIST} />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  className="ml-10 standard-dropdown-width"
                  name="billingMethod"
                  label="Method Type"
                >
                  <SelectDropdown items={BILLLING_METHOD_LISTS} />
                </Form.Item>
              </Col>
              {currentReport !== "Payments Against Lines" && (
                <Col>
                  <Form.Item
                    className="ml-10 standard-dropdown-width"
                    name="userType"
                    label="User Type"
                  >
                    <SelectDropdown items={USER_TYPE} />
                  </Form.Item>
                </Col>
              )}
              <Col>
                <Form.Item
                  className="ml-10 standard-input-width"
                  name="msisdn"
                  label="MSISDN"
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]*$/),
                      message: "Enter correct MSISDN!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    maxLength="12"
                    minLength="12"
                    placeholder="92300xxxxxxx"
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>

        {currentReport !== "" && (
          <Fragment>
            <Row layout="vertical" justify="start">
              {currentReport !== "Average Payment" && (
                <Col>
                  <Form.Item
                    className="standard-input-width"
                    name="transactionId"
                    label="Transaction ID"
                    rules={
                      currentReport === "Total Initiated"
                        ? [
                            {
                              pattern: new RegExp(/^[0-9]*$/),
                              message: "Enter only numeric digits!",
                            },
                          ]
                        : []
                    }
                  >
                    <Input
                      disabled={currentReport === "Average Payment"}
                      placeholder="123123"
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={8}>
                <div
                  className={
                    currentReport === "Average Payment"
                      ? "billing-menu-datelabel"
                      : "ml-10 billing-menu-datelabel"
                  }
                >
                  <span>Creation From:</span>
                  <span>Creation To:</span>
                </div>
                <Form.Item
                  className={currentReport === "Average Payment" ? "" : "ml-10"}
                  name="dateRange"
                >
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
                  <Button disabled={!billingReports.list?.length}>
                    <CSVLink
                      filename="Billing Reports"
                      data={billingReports.list || []}
                      headers={getHeader()}
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
                  {getPaymentLable()}
                  {currentReport === "Average Payment"
                    ? billingReports.averagePayment
                    : billingReports.recordCount}
                </Form.Item>
              </Col>
            </Row>
          </Fragment>
        )}
      </Form>
      {currentReport !== "" && (
        <ReportsViewTable
          loading={isLoading}
          scrollValue={columnData.scrollValue}
          dataSource={billingReports.list}
          columns={columnData.column}
          onPaginationChange={(page) => onPaginationChange(page)}
          currentPage={currentPage}
          showQuickJumper={true}
          defaultPageSize={billingReports.recordPerPage}
          totalRecordCount={billingReports.recordCount}
        />
      )}
    </Fragment>
  );
};
export default BillingReports;
