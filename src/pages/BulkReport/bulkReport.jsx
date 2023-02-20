import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { Fragment, useContext, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import allReports from "services/bulkDownloadService";
import bulkReportService from "services/bulkReportService";
import { BULK_REPORT_USECASE } from "Settings/bulkDownloadUsecase";

const columns = [
  {
    title: "Spoc Msisdn",
    dataIndex: "spoc_msisdn",
    key: "spoc_msisdn",
    // sorter: (a, b) => sortColumn(a, b, "ascend", "spoc_msisdn"),
  },
  {
    title: "Bulk Download Type",
    dataIndex: "bulk_download",
    key: "bulk_download",
  },
  {
    title: "Customer Reference",
    dataIndex: "customer_ref",
    key: "customer_ref",
    //sorter: (a, b) => sortColumn(a, b, "ascend", "customer_reference"),
  },
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "Bill Month",
    dataIndex: "bill_month",
    key: "bill_month",
    //sorter: (a, b) => sortColumn(a, b, "ascend", "billMonth"),
  },
  {
    title: "Bill Year",
    dataIndex: "bill_year",
    key: "bill_year",
  },
  {
    title: "Total Lines",
    dataIndex: "totalLines",
    key: "totalLines",
  },
  {
    title: "Successful Download",
    dataIndex: "totalSucess",
    key: "totalSucess",
  },
  {
    title: "Failure Download",
    dataIndex: "totalFailed",
    key: "totalFailed",
  },
  {
    title: "Pending Download",
    dataIndex: "totalPending",
    key: "totalPending",
  },
  {
    title: "Date Initiated",
    dataIndex: "date_initiated",
    key: "date_initiated",
  },
];

const headers = columns.map((col) => {
  return {
    key: col.key,
    lable: col.title,
  };
});
const MENU_ITEMS_LIST = [
  { key: "Bulk Bill Download", displayValue: "Bulk Bill Download" },
  { key: "Bulk Tax Certificate", displayValue: "Bulk Tax Certificate" },
  { key: "Bulk Ledger Download", displayValue: "Bulk Ledger Download" },
  { key: "Bulk CDRs Download", displayValue: "Bulk CDRs Download" },
  { key: "Tax Detail Excel", displayValue: "Tax Detail Excel Downloads" },
];
const { RangePicker } = DatePicker;
const BulkReport = () => {
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const { globalState } = useContext(AppContext);

  const getAllBulkReports = async (filters) => {
    try {
      setLoading(true);
      const data = await bulkReportService.getBulkReport(filters);
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
  const onPaginationChange = (page) => {
    setCurrentPage(page);
    try {
      const formData = form.getFieldValue();
      const filters = {
        data: {
          menuItems: formData.menuItems,
          msisdn: formData.msisdn,
          fromDate: dateRange[0] ? dateRange[0] : "",
          toDate: dateRange[1] ? dateRange[1] : "",
        },
        pageNumber: page,
      };
      getAllBulkReports(filters);
    } catch (err) {
      errorHandler(err);
    }
  };
  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      msisdn: formData.msisdn,
      menuItems: formData.menuItems,
      fromDate: dateRange[0] ? dateRange[0] : "",
      toDate: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: BULK_REPORT_USECASE,
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
      <h3 className="mb-4">Bulk Download Reports</h3>
      <Form
        form={form}
        onFinish={(values) => {
          setCurrentPage(1);
          try {
            const filters = {
              data: {
                menuItems: values.menuItems,
                msisdn: values.msisdn,
                fromDate: dateRange[0] ? dateRange[0] : "",
                toDate: dateRange[1] ? dateRange[1] : "",
              },
              pageNumber: 1,
            };
            getAllBulkReports(filters);
          } catch (err) {
            errorHandler(err);
          }
        }}
        initialValues={{
          menuItems: "Bulk Bill Download",
          msisdn: "",
          fromDate: "",
          toDate: "",
        }}
        layout="vertical"
      >
        <Row>
          <Col span={5}>
            <Form.Item name="menuItems" label="Menu Items">
              <SelectDropdown items={MENU_ITEMS_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={4}>
            <Form.Item
              rules={[
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: "Enter correct MSISDN!",
                },
              ]}
              name="msisdn"
              label="MSISDN"
            >
              <Input maxLength={12} placeholder="92300xxxxxxx" />
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <div className="datepicker-label">
              <span>From:</span>
              <span>To:</span>
            </div>
            <Form.Item name="dateRange">
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
            <Form.Item Item label=" ">
              <Button htmlType="submit" disabled={!dataSource?.list?.length}>
                <CSVLink
                  filename="Bulk Download"
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
        dataSource={dataSource.list}
        columns={columns}
        scrollValue={1800}
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
export default BulkReport;
