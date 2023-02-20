import React, { Fragment, useState, useEffect } from "react";
import { Form, Col, Button, Row, DatePicker, Modal } from "antd";
import SelectDropdown from "components/common/selectDropdown";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SalesStatusService from "services/salesStatusService";
import { useErrorHandler } from "react-error-boundary";
import moment from "moment";
const { RangePicker } = DatePicker;

const STATUS_LIST = [
  { key: "", displayValue: "Please Select One" },
  { key: "GENERAL", displayValue: "General" },
  { key: "SOC", displayValue: "SOC" },
  { key: "CMET", displayValue: "CMET" },
  { key: "SOC Reject", displayValue: "SOC Reject" },
  { key: "CMET Reject", displayValue: "CMET Reject" },
  { key: "COMPLETED", displayValue: "Completed" },
];

const REQUEST_TYPES_LIST = [
  { key: "", displayValue: "Please Select One" },
  { key: "Normal", displayValue: "NORMAL" },
  { key: "MNP", displayValue: "MNP" },
  { key: "REORG", displayValue: "REORG" },
  { key: "newnumber", displayValue: "New Number" },
];

const SIM_DETAIL_COLUMNS = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    sorter: (a, b) => a["id"] - b["id"],
  },
  {
    title: "Request Id",
    dataIndex: "request_id",
    key: "request_id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Line Msisdn",
    dataIndex: "line_msidn",
    key: "line_msidn",
  },
  {
    title: "CNIC",
    dataIndex: "cnic",
    key: "cnic",
  },
  {
    title: "Boltan",
    dataIndex: "boltan",
    key: "boltan",
  },
  {
    title: "Bundle",
    dataIndex: "bundle",
    key: "bundle",
  },
  {
    title: "Status",
    dataIndex: "cron_status",
    key: "cron_status",
  },
  {
    title: "Access Level",
    dataIndex: "access_level",
    key: "access_level",
  },
  {
    title: "Donor",
    dataIndex: "",
    key: "",
  },
  {
    title: "Connection Type",
    dataIndex: "",
    key: "",
  },
  {
    title: "Act Date",
    dataIndex: "",
    key: "",
  },
  {
    title: "IMSI",
    dataIndex: "imsi",
    key: "imsi",
  },
];

const Sales = () => {
  const [visible, setVisible] = useState(false);
  const [isSubmitClicked, setSubmitClicked] = useState(false);
  const [salesReport, setSalesReport] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);
  const [simDetails, setSimDetails] = useState([]);

  useEffect(() => {
    getAllSalesStatusData();
    // eslint-disable-next-line
  }, []);

  const getAllSalesStatusData = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await SalesStatusService.getAllSalesStatus(page);
      setSalesReport({
        list: data.data,
        recordCount: data.count,
        recordPerPage: data.recordPerPage,
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      errorHandler(err);
    }
  };

  const onPaginationChange = (page) => {
    try {
      if (isSubmitClicked) {
        const formData = form.getFieldValue();

        const filter = {
          data: {
            selectedstatus: formData.selectedstatus,
            simRequestType: formData.simRequestType,
            fromDate: dateRange[0] ? dateRange[0] : "",
            toDate: dateRange[1] ? dateRange[1] : "",
          },
          pageNumber: page,
        };
        getFilteredSalesResults(filter);
      } else {
        getAllSalesStatusData(page);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const getSimDetails = async (id) => {
    try {
      const data = await SalesStatusService.getSimDetails(id);
      setSimDetails(data.data);
    } catch (err) {
      errorHandler(err);
    }
  };

  const getFilteredSalesResults = async (filters) => {
    try {
      setIsLoading(true);
      const data = await SalesStatusService.getFilteredSalesStatus(filters);
      setSalesReport({
        list: data.data,
        recordCount: data.count,
        recordPerPage: data.recordPerPage,
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      errorHandler(err);
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a["id"] - b["id"],
    },
    {
      title: "Spoc",
      dataIndex: "msisdn",
      key: "msisdn",
    },
    {
      title: "Reference Id",
      dataIndex: "customer_reference",
      key: "customer_reference",
      sorter: (a, b) =>
        a["customer_reference"].length - b["customer_reference"].length,
    },
    {
      title: "Wavier Required Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      sorter: (a, b) => a["total_amount"] - b["total_amount"],
    },
    {
      title: "Initial Status",
      key: "initial_status",
      dataIndex: "initial_status",
      sorter: (a, b) => a["initial_status"].length - b["initial_status"].length,
    },
    {
      title: "Sim Request Type",
      key: "sim_req_type",
      dataIndex: "sim_req_type",
      sorter: (a, b) => a["sim_req_type"].length - b["sim_req_type"].length,
    },
    {
      title: "Spoc Type",
      key: "spoc_type",
      dataIndex: "spoc_type",
      sorter: (a, b) => a["spoc_type"].length - b["spoc_type"].length,
    },
    {
      title: "CreatedAt",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          size="small"
          onClick={() => {
            getSimDetails(record.id);
            setVisible(true);
          }}
        >
          View Order Details
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <h3 className="mb-4">Sales Status</h3>
      <Form
        form={form}
        initialValues={{ selectedstatus: "", simRequestType: "" }}
        labelCol={{ span: 25 }}
        wrapperCol={{ span: 25 }}
        layout="vertical"
        onFinish={(values) => {
          const filter = {
            data: {
              selectedstatus: values.selectedstatus,
              simRequestType: values.simRequestType,
              fromDate: dateRange[0] ? dateRange[0] : "",
              toDate: dateRange[1] ? dateRange[1] : "",
            },
            pageNumber: 1,
          };
          getFilteredSalesResults(filter);
        }}
      >
        <Row justify="space-between" align="middle">
          <Col span={5}>
            <Form.Item name="selectedstatus" label="Select Status">
              <SelectDropdown items={STATUS_LIST} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="simRequestType" label="Select Sim Request Type">
              <SelectDropdown items={REQUEST_TYPES_LIST} />
            </Form.Item>
          </Col>

          <Col>
            <Form.Item name="dateRange">
              <div className="datepicker-label">
                <span>From:</span>
                <span>To:</span>
              </div>
              <RangePicker
                onChange={(_date, dateString) => {
                  setDateRange(dateString);
                }}
                disabledDate={(current) => {
                  return current && current > moment().endOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label=" ">
              <Button htmlType="submit" onClick={() => setSubmitClicked(true)}>
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label=" ">
              <Button>Download Excel</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <ReportsViewTable
        onPaginationChange={(page) => onPaginationChange(page)}
        scrollValue={1300}
        columns={columns}
        dataSource={salesReport.list}
        loading={isLoading}
        showQuickJumper={true}
        defaultPageSize={salesReport.recordPerPage}
        totalRecordCount={salesReport.recordCount}
      />

      <Modal
        title="View Details"
        //onOk={() => setVisible(false)}
        maskTransitionName=""
        onCancel={() => setVisible(false)}
        footer={null}
        centered
        width={1000}
        visible={visible}
      >
        <ReportsViewTable
          size="small"
          className="mt-5"
          defaultPageSize={5}
          scrollValue={1300}
          dataSource={simDetails}
          columns={SIM_DETAIL_COLUMNS}
        />
        <Row justify="start">
          <Col>
            <Button>Download</Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  );
};
export default Sales;
