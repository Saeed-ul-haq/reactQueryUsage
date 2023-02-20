import React, { Fragment, useState, useContext } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import orderHistoryService from "services/orderHistoryService";
import { useErrorHandler } from "react-error-boundary";
import DateRangePicker from "components/common/dateRangePicker";
import { CSVLink } from "react-csv";
import { AppContext } from "context/globalContext";
import allReports from "services/bulkDownloadService";
import moment from "moment";

const columns = [
  {
    title: "Name - Mobile Number",
    dataIndex: "name_Mobile_Number",
    key: "nameMobile",
    render: (text) => {
      return `${text}`.replace(/<br\s*\/?>/gi, " ");
    },
  },
  {
    title: "Order Number",
    dataIndex: "order_No",
    key: "orderNumber",
  },
  {
    title: "Poc Number",
    dataIndex: "spoc_Mobile_Number",
    key: "pocNumber",
  },
  {
    title: "Details",
    dataIndex: "details",
    key: "details",
    render: (text) => {
      return text ? text.replace(/<br\s*\/?>/gi, " ") : "-";
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      return text ? `${text}`.replace(/<br\s*\/?>/gi, " ") : "-";
    },
  },
  {
    title: "Requested Date",
    dataIndex: "requested_Date",
    key: "requestDate",
  },
];

const headers = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "nameMobile",
    label: "Name - Mobile Number",
  },
  {
    key: "name_Mobile_Number",
    label: "Name Mobile Number",
  },
  {
    key: "orderNumber",
    label: "Order Number",
  },
  {
    key: "pocNumber",
    label: "Poc Number",
  },
  {
    key: "details",
    label: "Details",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "requested_Date",
    label: "Requested Date",
  },
  {
    key: "credit_Limit",
    label: "Credit Limit",
  },
  {
    key: "order_No",
    label: "Order No",
  },
  {
    key: "spoc_Mobile_Number",
    label: "Soc MObile Number",
  },
];
const USECASE_LISTS = [
  { key: "Change Of Sim", displayValue: "Change Of Sim" },
  { key: "Resume", displayValue: "Resume" },
  { key: "Change Of Package Plan", displayValue: "Change Of Package Plan" },
  { key: "Bolton Addition/Removal", displayValue: "Bolton Addition/Removal" },
  { key: "Bundle Addition/Removal", displayValue: "Bundle Addition/Removal" },
  { key: "New Number", displayValue: "New Number" },
  { key: "Reorg", displayValue: "Reorg" },
  { key: "MNP", displayValue: "MNP" },
];
const OrderHistory = () => {
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([
    new Date().toLocaleDateString("en-CA"),
    new Date().toLocaleDateString("en-CA"),
  ]);
  const { globalState } = useContext(AppContext);

  const getOrderHistory = async (filters) => {
    try {
      setLoading(true);
      const data = await orderHistoryService.getOrderHistory(filters);
      setDataSource({
        list: data.data ? data.data : [],
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };
  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      msisdn: formData.msisdn,
      useCase: formData.useCase || [],
      channel: "Reporting Portal",
      fromDate: dateRange[0] ? dateRange[0] : "",
      toDate: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: "Order_History",
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
      <h3 className="mb-4">Order History</h3>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          usecase: [],
          msisdn: "",
          toDate: "",
          fromDate: "",
        }}
        onFinish={(values) => {
          const filters = {
            data: {
              useCase: values.usecase,
              msisdn: values.msisdn,
              fromDate: dateRange[0] ? dateRange[0] : "",
              toDate: dateRange[1] ? dateRange[1] : "",
            },
          };
          getOrderHistory(filters);
        }}
      >
        <Row>
          <Col span={5}>
            <Form.Item name="usecase" label="Usecase">
              <SelectDropdown
                items={USECASE_LISTS}
                placeholder="Select Usecase"
                mode="multiple"
              />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={3}>
            <Form.Item
              label="MSISDN"
              name="msisdn"
              rules={[
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Enter correct MSISDN!",
                },
              ]}
            >
              <Input
                maxLength="12"
                minLength="12"
                autoComplete="off"
                placeholder="92300xxxxxxx"
              />
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item name="dateRange">
              <div className="datepicker-label">
                <span>From:</span>
                <span>To:</span>
              </div>
              <DateRangePicker
                onChange={(_date, dateString) => {
                  setDateRange(dateString);
                }}
                disabledDate={(current) => {
                  return current && current > moment().endOf("day");
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
                  filename="Order history"
                  headers={headers}
                  data={dataSource.list || []}
                >
                  Download Excel
                </CSVLink>
              </Button>
            </Form.Item>
          </Col>{" "}
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button onClick={downloadAllReports}>Download All</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <ReportsViewTable
        scrollValue={1400}
        scrollY={400}
        dataSource={dataSource.list}
        loading={loading}
        columns={columns}
        isPagination={false}
      />
    </Fragment>
  );
};
export default OrderHistory;
