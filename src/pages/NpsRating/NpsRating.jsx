import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import allReportsService from "services/bulkDownloadService";
import { getNpsRatingList } from "services/npsRatingService";
import { NPS_RATING_USECASE } from "Settings/bulkDownloadUsecase";

const USER_TYPE = [
  { key: "All", displayValue: "All" },
  { key: "SPOC", displayValue: "SPOC" },
  { key: "Line", displayValue: "LINE" },
  { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
];
const RECOMMENDATION_SCORE = [
  { key: "1", displayValue: "1" },
  { key: "2", displayValue: "2" },
  { key: "3", displayValue: "3" },
  { key: "4", displayValue: "4" },
  { key: "5", displayValue: "5" },
  { key: "6", displayValue: "6" },
  { key: "7", displayValue: "7" },
  { key: "8", displayValue: "8" },
  { key: "9", displayValue: "9" },
  { key: "10", displayValue: "10" },
];

const COLUMNS = [
  {
    title: "Msisdn",
    dataIndex: "msisdn",
    key: "msisdn",
  },
  {
    title: "Channel",
    dataIndex: "channel",
    key: "channel",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
  },
  {
    title: "Feedback",
    dataIndex: "feedback",
    key: "feedback",
  },
  {
    title: "Recommendation Score",
    dataIndex: "recommendation_score",
    key: "recommendation_score",
  },
  {
    title: "User Type",
    dataIndex: "user_type",
    key: "user_type",
  },
];
const headers = COLUMNS.map((col) => {
  return { key: col.key, label: col.title };
});
const NpsRating = () => {
  const [allReports, setAllReports] = useState([]);
  const [recordCounts, setRecordCounts] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { globalState } = useContext(AppContext);

  const errorHandler = useErrorHandler();

  useEffect(() => {
    const filters = {
      data: {
        msisdn: "",
        user_type: "",
        datefrom: "",
        recommendation_score: [],
        dateto: "",
      },
      pageNumber: 1,
    };
    getAllNpsReports(filters);
  }, []);

  const getAllNpsReports = async (filters) => {
    setLoading(true);

    const data = await getNpsRatingList(filters);
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
          recommendation_score: formData.recommendation_score,
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
      recommendation_score: formData.recommendation_score,
      datefrom: dateRange[0] ? dateRange[0] : "",
      dateto: dateRange[1] ? dateRange[1] : "",
    };
    const headers = {
      useCase: NPS_RATING_USECASE,
      userEmail: globalState?.userDetails?.email,
    };
    const userData = await allReportsService(data, headers);
    setLoading(true);
    console.log("userData >>>>>>>>>>>>>>>", userData);
    setLoading(false);
    if (userData.statusCode === 200) {
      message.success(userData?.message);
    }
  };
  return (
    <div>
      <h3 className="mb-4">NPS Rating</h3>
      <Form
        initialValues={{
          recommendationScore: [],
          userType: [],
          msisdn: "",
        }}
        onFinish={(values) => {
          const { msisdn, user_type, recommendation_score } = values;
          setCurrentPage(1);
          try {
            let reportFilter = {
              data: {
                msisdn,
                user_type,
                recommendation_score,
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
              <SelectDropdown
                items={USER_TYPE}
                placeholder="select User"
                mode="multiple"
              />
            </Form.Item>
          </Col>
          <Col span={5} className="ml-10">
            <Form.Item name="recommendation_score" label="Recommendation Score">
              <SelectDropdown
                placeholder="Select Rating"
                mode="multiple"
                items={RECOMMENDATION_SCORE}
              />
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
              <Button
                htmlType="submit"
                style={{ minWidth: "120px" }}
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button disabled={!allReports.length}>
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
        scrollValue={800}
        loading={loading}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        totalRecordCount={recordCounts}
      />
    </div>
  );
};
export default NpsRating;
