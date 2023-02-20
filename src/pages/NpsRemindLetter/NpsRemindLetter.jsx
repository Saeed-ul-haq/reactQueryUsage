import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import BulkReportsData from "services/bulkDownloadService";
import { getNpsRemindList } from "services/npsRatingService";
import { NPS_RATING_REMIND_LETTER_USECASE } from "Settings/bulkDownloadUsecase";

const USER_TYPE = [
  { key: "All", displayValue: "All" },
  { key: "SPOC", displayValue: "SPOC" },
  { key: "Line", displayValue: "LINE" },
  { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
];

const COLUMNS = [
  {
    title: "Msisdn",
    dataIndex: "msisdn",
    key: "msisdn",
  },
  {
    title: "Customer Reference",
    dataIndex: "customer_reference",
    key: "customer_reference",
  },
  {
    title: "User Type",
    dataIndex: "user_type",
    key: "user_type",
  },
  {
    title: "Remind Me Later Total Count",
    dataIndex: "totalRml",
    key: "totalRml",
  },
];
const headers = COLUMNS.map((col) => {
  return { key: col.key, label: col.title };
});
const NpsRemindLetter = () => {
  const [allReports, setAllReports] = useState([]);
  const [recordCounts, setRecordCounts] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const errorHandler = useErrorHandler();
  const [form] = Form.useForm();
  const { globalState } = useContext(AppContext);

  useEffect(() => {
    let reportFilter = {
      data: {
        msisdn: "",
        user_type: "",
        datefrom: "",
        dateto: "",
      },
      pageNumber: 1,
    };
    getAllNpsReports(reportFilter);
  }, []);

  const getAllNpsReports = async (filters) => {
    setLoading(true);
    const data = await getNpsRemindList(filters);
    setAllReports(data.data);
    setRecordCounts(data.count);
    setRecordPerPage(data.recordPerPage);
    setLoading(false);
  };
  const onPaginationChange = (page) => {
    setCurrentPage(page);
    try {
      const formData = form.getFieldValue();
      let reportFilter = {
        data: {
          msisdn: formData.msisdn,
          user_type: formData.user_type,
          datefrom: dateRange[0] ? dateRange[0] : "",
          dateto: dateRange[1] ? dateRange[1] : "",
        },
        pageNumber: page,
      };
      getAllNpsReports(reportFilter);
    } catch (err) {
      errorHandler(err);
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      msisdn: formData.msisdn,
      user_type: formData.user_type,
      datefrom: dateRange[0] ? dateRange[0] : "",
      dateto: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: NPS_RATING_REMIND_LETTER_USECASE,
      userEmail: globalState?.userDetails?.email,
    };
    const userData = await BulkReportsData(data, headers);
    setLoading(true);
    console.log("userData >>>>>>>>>>>>>>>", userData);
    setLoading(false);
    if (userData.statusCode === 200) {
      message.success(userData?.message);
    }
  };
  return (
    <div>
      <h3 className="mb-4">NPS Rating Remainder</h3>
      <Form
        initialValues={{
          userType: [],
          msisdn: "",
        }}
        onFinish={(values) => {
          const { msisdn, user_type } = values;
          setCurrentPage(1);
          try {
            let reportFilter = {
              data: {
                msisdn,
                user_type,
                datefrom: dateRange[0] ? dateRange[0] : "",
                dateto: dateRange[1] ? dateRange[1] : "",
              },
              pageNumber: 1,
            };
            getAllNpsReports(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
        layout="vertical"
      >
        <Row>
          <Col span={5}>
            <Form.Item name="user_type" label="User">
              <SelectDropdown items={USER_TYPE} placeholder="select User" />
            </Form.Item>
          </Col>
          <Col span={3} className="ml-10">
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
          <Col span={5} className="ml-10">
            <div className="datepicker-label">
              <span>From:</span>
              <span>To:</span>
            </div>
            <Form.Item>
              <DatePicker.RangePicker
                onChange={(_, dateStr) => {
                  setDateRange(dateStr);
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
              <Button disabled={!allReports?.length}>
                <CSVLink
                  filename="NPS Reporting"
                  headers={headers}
                  data={allReports}
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

      <ReportsViewTable
        dataSource={allReports}
        columns={COLUMNS}
        scrollValue={400}
        loading={loading}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        // defaultPageSize={recordPerPage}
        totalRecordCount={recordCounts}
      />
    </div>
  );
};
export default NpsRemindLetter;
