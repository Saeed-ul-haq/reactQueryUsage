import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { Fragment, useContext, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import allReports from "services/bulkDownloadService";
import eSignOffService from "services/eSignOffService";
import { E_SIGNOFF_USECASE } from "Settings/bulkDownloadUsecase";
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Customer Reference Number",
    dataIndex: "customer_ref_id",
    key: "referenceNumber",
  },
  {
    key: "signoffdate",
    title: "E-Sign Off Date",
    dataIndex: "date_time",
  },
  { key: "ip", title: "IP Address", dataIndex: "ip_address" },
  { key: "msisdn", title: "MSISDN", dataIndex: "msisdn" },
];
const ESignOff = () => {
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([
    // new Date().toLocaleDateString("en-CA"),
    // new Date().toLocaleDateString("en-CA"),
  ]);
  const { globalState } = useContext(AppContext);

  const getEsignOff = async (filters) => {
    try {
      const data = await eSignOffService.getEsignOff(filters);
      setLoading(true);
      setDataSource({
        list: Array.isArray(data.data) ? data.data : [data.data],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };
  const onPaginationChange = (page) => {
    setCurrentPage(page);
    try {
      const formData = form.getFieldValue();
      const filters = {
        data: {
          customerReferenceId: formData.customerReferenceId,
          startDate: dateRange[0] ? dateRange[0] : "",
          endDate: dateRange[1] ? dateRange[1] : "",
        },
        pageNumber: page,
      };
      getEsignOff(filters);
    } catch (err) {
      errorHandler(err);
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      customerReferenceId: formData.customerReferenceId,
      startDate: dateRange[0] ? dateRange[0] : "",
      endDate: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: E_SIGNOFF_USECASE,
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
      <h3 className="mb-4">E-Sign Off</h3>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customerReferenceId: "",
          fromDate: "",
          toDate: "",
        }}
        onFinish={(values) => {
          setCurrentPage(1);
          const filters = {
            data: {
              customerReferenceId: values.customerReferenceId,
              startDate: dateRange[0] ? dateRange[0] : "",
              endDate: dateRange[1] ? dateRange[1] : "",
            },
            pageNumber: 1,
          };
          getEsignOff(filters);
        }}
      >
        <Row>
          <Col>
            <Form.Item
              label="Customer Reference #"
              name="customerReferenceId"
              rules={[
                {
                  pattern: new RegExp("^[0-9-!@#$%*?]"),
                  message: "Enter valid Costumer Number!",
                },
              ]}
            >
              <Input maxLength="14" autoComplete="off" placeholder="123123" />
            </Form.Item>
          </Col>
          <Col className="ml-10">
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
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button>Download Excel</Button>
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
        scrollValue={900}
        dataSource={dataSource.list}
        loading={loading}
        columns={columns}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
      />
    </Fragment>
  );
};
export default ESignOff;
