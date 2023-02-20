import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  DatePicker,
  Tooltip,
} from "antd";
import AddFeedbackModal from "components/common/FeedbackModal/addFeedbackModal";
import ViewFeedbackModal from "components/common/FeedbackModal/viewFeedbackModal";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";
import { AppContext } from "context/globalContext";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import allReports from "services/bulkDownloadService";
import GeneralFeedbackServices from "services/GeneralFeedbackService";
import { GENERAL_FEEDBACK_USECASE } from "Settings/bulkDownloadUsecase";
const { RangePicker } = DatePicker;

export const FeedbackStatus = [
  { key: "Open", displayValue: "Open" },
  { key: "Not Contacted", displayValue: "Not Contacted" },
  {
    key: "Contacted / Not Answering",
    displayValue: "Contacted / Not Answering",
  },
  {
    key: "Contacted / Not Interested",
    displayValue: "Contacted / Not Interested",
  },
  { key: "Contacted / In Progress", displayValue: "Contacted / In Progress" },
  { key: "Contacted / Closed", displayValue: "Contacted / Closed" },
];
export default function GeneralFeedback() {
  const [updateModalVisiblility, setUpdateModalVisibility] = useState(false);
  const [viewModalVisiblility, setViewModalVisiblility] = useState(false);
  const [actionModal, setActionModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const errorHandler = useErrorHandler();
  const [submitClicked, setSubmitClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);
  const [feedbackReport, setFeedbackReport] = useState([]);
  const [comments, setCommentDetails] = useState([]);
  const { globalState } = useContext(AppContext);
  useEffect(() => {
    getAllGeneralReports(1);
  }, []);

  const getAllGeneralReports = async (pageNumber) => {
    setIsLoading(true);
    const data = await GeneralFeedbackServices.getAllFeedback(pageNumber);
    setFeedbackReport({
      list: data.data,
      recordCount: data.count,
      recordPerPage: data.recordPerPage,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (actionModal === "update") {
      setUpdateModalVisibility(true);
    } else if (actionModal === "view") {
      setViewModalVisiblility(true);
    }
  }, [actionModal]);

  const getFilteredGeneralReport = async (filters) => {
    try {
      setIsLoading(true);
      const data = await GeneralFeedbackServices.getFilteredFeedback(filters);
      setFeedbackReport({
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
    setCurrentPage(page);
    try {
      if (submitClicked) {
        const formData = form.getFieldValue();
        let reportFilter = {
          data: {
            datefrom: dateRange[0] ? dateRange[0] : "",
            dateto: dateRange[1] ? dateRange[1] : "",
            msisdn: formData.msisdn,
            feedback_option: formData.feedback_option,
            userType: formData.userType,
            use_case: formData.use_case,
          },
          pageNumber: page,
        };
        getFilteredGeneralReport(reportFilter);
      } else {
        getAllGeneralReports(page);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const getCommentDetails = async (id) => {
    try {
      const data = await GeneralFeedbackServices.getCommentDetails(id);

      setCommentDetails(data.data);
    } catch (err) {
      errorHandler(err);
    }
  };

  const USER_TYPE_LIST = [
    { key: "SPOC", displayValue: "SPOC" },
    { key: "LINE", displayValue: "LINE" },
    { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
  ];

  const STAR_RATING_LIST = [
    { key: "1", displayValue: "1" },
    { key: "2", displayValue: "2" },
    { key: "3", displayValue: "3" },
    { key: "4", displayValue: "4" },
    { key: "5", displayValue: "5" },
  ];

  const RECOMENDED_RATING_LIST = [
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

  const columns = [
    {
      title: "Customer Id",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    {
      title: "Msisdn",
      dataIndex: "msisdn",
      key: "msisdn",
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Stars",
      dataIndex: "stars",
      key: "stars",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      width: 300,
      render: (text, record) => (
        <Tooltip title={text}>
          <span>{`${
            text?.length > 40 ? `${text?.slice(0, 50)}...` : text
          }`}</span>
        </Tooltip>
      ),
    },
    {
      title: "Feedback For",
      dataIndex: "feedback_for",
      key: "feedback_for",
    },
    {
      title: "JBW Usage",
      dataIndex: "jbw_usage",
      key: "jbw_usage",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Feedback Status",
      dataIndex: "feedback_status",
      key: "feedback_status",
    },
    {
      title: "Contacted At",
      dataIndex: "contacted_at",
      key: "contacted_at", // Hide in case of Grid but will be visible in download
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <SelectDropdown
          size="small"
          style={{ width: 200 }}
          value=""
          onChange={(value) => {
            if (value === "update") {
              getCommentDetails(record.id);
            } else if (value === "view") {
              getCommentDetails(record.id);
            }
            setActionModal(value);
          }}
          items={[
            { key: "", displayValue: "Please Select Action" },
            { key: "update", displayValue: "Add/Update Comments" },
            { key: "view", displayValue: "View Comments" },
          ]}
        />
      ),
    },
  ];

  const headers = [
    {
      label: "Customer Id",

      key: "customer_id",
    },
    {
      label: "Msisdn",

      key: "msisdn",
    },
    {
      label: "Company Name",

      key: "company_name",
    },
    {
      label: "User Type",

      key: "user_type",
    },
    {
      label: "Stars",

      key: "stars",
    },
    {
      label: "Score",

      key: "score",
    },
    {
      label: "Feedback",

      key: "feedback",
    },
    {
      label: "Feedback For",

      key: "feedback_for",
    },
    {
      label: "JBW Usage",
      key: "jbw_usage",
    },
    {
      label: "Created At",
      key: "created_at",
    },
    {
      label: "Contacted At",
      key: "contacted_at",
    },
    {
      label: "Operational Coments",
      key: "operational_coments",
    },
    {
      label: "Operational Lov",
      key: "operational_lov",
    },
    {
      label: "Feedback Status",
      key: "feedback_status",
    },
    {
      label: "Feedback other detail",
      key: "feedback_other_detail",
    },
  ];
  const addUpdateComments = async (values, id) => {
    try {
      let filterValues = values;
      filterValues.id = id;
      const data = await GeneralFeedbackServices.putCommentsOnFeedback(
        filterValues
      );
      if (data.success) {
        message.success("Comment added!");

        setTimeout(() => {
          getAllGeneralReports();
        }, 1000);
        setUpdateModalVisibility(false);
        setActionModal("");
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      msisdn: formData.msisdn,
      userType: formData.userType,
      recommedationRating: formData.recommendationRating.toString(),
      starRating: formData.starRating.toString(),
      datefrom: dateRange[0] ? dateRange[0] : "",
      dateto: dateRange[1] ? dateRange[1] : "",
      feedback_status: formData.feedback_status,
    };
    const headers = {
      useCase: GENERAL_FEEDBACK_USECASE,
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
    <div>
      <h3 className="mb-4">General Feedback</h3>
      <Form
        initialValues={{
          salesStatus: "",
          simRequestType: "",
          starRating: [],
          recommendationRating: [],
          userType: [],
          feedback_status: "",
        }}
        onFinish={(values) => {
          setCurrentPage(1);
          try {
            let reportFilter = {
              data: {
                msisdn: values.msisdn,
                userType: values.userType,
                recommedationRating: values.recommendationRating.toString(),
                starRating: values.starRating.toString(),
                datefrom: dateRange[0] ? dateRange[0] : "",
                dateto: dateRange[1] ? dateRange[1] : "",
                feedback_status: values.feedback_status,
              },

              pageNumber: 1,
            };
            getFilteredGeneralReport(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
        form={form}
        layout="vertical"
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
              <Input maxLength={12} placeholder="92300xxxxxxx" />
            </Form.Item>
          </Col>

          <Col className="ml-10" span={5}>
            <Form.Item name="userType" label="User Type">
              <SelectDropdown items={USER_TYPE_LIST} mode="multiple" />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item name="feedback_status" label="Feedback Status">
              <SelectDropdown
                placeholder="Please Select one"
                items={FeedbackStatus}
              />
            </Form.Item>
          </Col>

          <Col className="ml-10" span={8}>
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
          <Col span={5}>
            <Form.Item name="starRating" label="Star Rating">
              <SelectDropdown
                placeholder="Select Rating"
                mode="multiple"
                items={STAR_RATING_LIST}
              />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item
              name="recommendationRating"
              label="Recommendation Rating"
            >
              <SelectDropdown
                placeholder="Select Rating"
                mode="multiple"
                items={RECOMENDED_RATING_LIST}
              />
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button htmlType="submit" onClick={() => setSubmitClicked(true)}>
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button title="download">
                <CSVLink
                  filename="general feedback"
                  data={feedbackReport.list || []}
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
      <ReportsViewTable
        columns={columns}
        dataSource={feedbackReport.list}
        scrollValue={2000}
        loading={isLoading}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        showQuickJumper={true}
        defaultPageSize={feedbackReport.recordPerPage}
        totalRecordCount={feedbackReport.recordCount}
      />
      <AddFeedbackModal
        onSubmit={addUpdateComments}
        visible={updateModalVisiblility}
        onOKClick={(flag) => {
          setUpdateModalVisibility(flag);
          setActionModal("");
        }}
        onCancelClick={(flag) => {
          setUpdateModalVisibility(flag);
          setActionModal("");
        }}
        data={comments}
        modalTitle="Add Comments"
        width={600}
      />
      <ViewFeedbackModal
        data={comments}
        visible={viewModalVisiblility}
        onOKClick={(flag) => {
          setViewModalVisiblility(flag);
          setActionModal("");
        }}
        onCancelClick={(flag) => {
          setViewModalVisiblility(flag);
          setActionModal("");
        }}
        modalTitle="View Comments"
        width={600}
      />
    </div>
  );
}
