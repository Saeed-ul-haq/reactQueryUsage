import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
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
import TransactionalFeedbackServices from "services/transactionalFeedbackService";
import { TRANSACTIONAL_FEEDBACK_USECASE } from "Settings/bulkDownloadUsecase";

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

export default function TransactionalFeedback() {
  const [updateModalVisiblility, setUpdateModalVisibility] = useState(false);
  const [viewModalVisiblility, setViewModalVisiblility] = useState(false);
  const [actionModal, setActionModal] = useState("");
  const [dateRange, setDataRange] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const errorHandler = useErrorHandler();
  const [comments, setCommentDetails] = useState([]);
  const [form] = Form.useForm();
  const { globalState } = useContext(AppContext);

  useEffect(() => {
    getAllFeedbackReports(1);
  }, []);

  useEffect(() => {
    if (actionModal === "update") {
      setUpdateModalVisibility(true);
    } else if (actionModal === "view") {
      setViewModalVisiblility(true);
    }
  }, [actionModal]);

  const getAllFeedbackReports = async (pageNumber) => {
    setIsLoading(true);
    const data = await TransactionalFeedbackServices.getAllFeedback(pageNumber);
    setFeedbackReport({
      list: data.data,
      recordCount: data.count,
      recordPerPage: data.recordPerPage,
    });
    setIsLoading(false);
  };

  const getFilteredFeedbackReport = async (filters) => {
    try {
      setIsLoading(true);
      const data = await TransactionalFeedbackServices.getFilteredFeedback(
        filters
      );
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

  const getCommentDetails = async (id) => {
    try {
      const data = await TransactionalFeedbackServices.getCommentDetails(id);
      setCommentDetails(data.data);
    } catch (err) {
      errorHandler(err);
    }
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    if (submitClicked) {
      try {
        const formData = form.getFieldValue();
        let reportFilter = {
          data: {
            datefrom: dateRange[0] ? dateRange[0] : "",
            dateto: dateRange[1] ? dateRange[1] : "",
            msisdn: formData.msisdn,
            feedbackOption: formData.feedbackOption,
            user_type: formData.user_type,
            use_case: formData.use_case,
          },
          pageNumber: page,
        };
        getFilteredFeedbackReport(reportFilter);
      } catch (err) {
        errorHandler(err);
      }
    } else {
      getAllFeedbackReports(page);
    }
  };

  const USER_TYPE_LIST = [
    { key: "SPOC", displayValue: "SPOC" },
    { key: "LINE", displayValue: "LINE" },
    { key: "Sec_SPOC", displayValue: "Sec_SPOC" },
  ];

  const FEEDBACK_OPTION_LIST = [
    { key: "", displayValue: "Select Option" },
    { key: "satisfactory", displayValue: "Satisfactory" },
    { key: "unsatisfactory", displayValue: "UnSatisfactory" },
  ];

  const USECASE_LIST = [
    { key: "", displayValue: "Please Select One" },

    { key: "Add lines to group", displayValue: "Add lines to group" },
    { key: "Bill Summary", displayValue: "Bill Summary" },
    {
      key: "Change Package /Data/Voice- Bolt- Ons /Add-Ons",
      displayValue: "Change Package /Data/Voice- Bolt- Ons /Add-Ons",
    },
    { key: "Change SIM", displayValue: "Change SIM" },
    { key: "Credit Card Payment", displayValue: "Credit Card Payment" },
    { key: "Delete lines from group", displayValue: "Delete lines from group" },
    {
      key: "Download Line Tax Certificate",
      displayValue: "Download Line Tax Certificate",
    },
    {
      key: "Download Statement summary",
      displayValue: "Download Statement summary",
    },
    { key: "Jazz Cash Payment", displayValue: "Jazz Cash Payment" },
    { key: "Manage Groups", displayValue: "Manage Groups" },
    { key: "Order new SIM", displayValue: "Order new SIM" },
    { key: "Other Payment", displayValue: "Other Payment" },
    { key: "Others", displayValue: "Others" },
    { key: "Re-organization", displayValue: "Re-organization" },
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
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Feedback Option",
      dataIndex: "feedback_option",
      key: "feedback_option",
    },
    {
      title: "Use Case",
      dataIndex: "use_case",
      key: "use_case",
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
      label: "Feedback",
      key: "feedback",
    },
    {
      label: "Feedback Option",
      key: "feedback_option",
    },
    {
      label: "Use Case",
      key: "use_case",
    },
    {
      label: "Contacted At",
      key: "contacted_at", // Hide in case of Grid but will be visible in download
    },
    {
      label: "Feedback Status",
      key: "feedback_status",
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
      label: "Created At",
      key: "created_at",
    },
  ];

  const addUpdateComments = async (values, id) => {
    try {
      let filterValues = values;
      filterValues.id = id;
      const data = await TransactionalFeedbackServices.putCommentsOnFeedback(
        filterValues
      );
      if (data.success) {
        message.success("Comment added!");

        setUpdateModalVisibility(false);
        setActionModal("");
        setTimeout(() => {
          getAllFeedbackReports();
        }, 1000);
      }
    } catch (err) {
      errorHandler(err);
    }
  };

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      datefrom: dateRange[0] ? dateRange[0] : "",
      dateto: dateRange[1] ? dateRange[1] : "",
      msisdn: formData.msisdn,
      feedbackOption: formData.feedbackOption,
      userType: formData.user_type,
      usecase: formData.use_case,
      feedback_status: formData.feedback_status,
    };
    const headers = {
      useCase: TRANSACTIONAL_FEEDBACK_USECASE,
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
      <h3 className="mb-4">Transactional Feedback</h3>
      <Form
        form={form}
        initialValues={{
          msisdn: "",
          user_type: [],
          feedback_option: "",
          feedback_status: "",
          use_case: "",
        }}
        onFinish={(values) => {
          setCurrentPage(1);
          try {
            let reportFilter = {
              data: {
                datefrom: dateRange[0] ? dateRange[0] : "",
                dateto: dateRange[1] ? dateRange[1] : "",
                msisdn: values.msisdn,
                feedbackOption: values.feedbackOption,
                userType: values.user_type,
                usecase: values.use_case,
                feedback_status: values.feedback_status,
              },
              pageNumber: 1,
            };
            getFilteredFeedbackReport(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
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
            <Form.Item name="user_type" label="User Type">
              <SelectDropdown items={USER_TYPE_LIST} mode="multiple" />
            </Form.Item>
          </Col>

          <Col className="ml-10" span={5}>
            <Form.Item name="feedbackOption" label="Feedback Option">
              <SelectDropdown items={FEEDBACK_OPTION_LIST} />
            </Form.Item>
          </Col>
          <Col className="ml-10" span={5}>
            <Form.Item name="feedback_status" label="Feedback status">
              <SelectDropdown items={FeedbackStatus} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item name="use_case" label="Usecase">
              <SelectDropdown items={USECASE_LIST} />
            </Form.Item>
          </Col>

          <Col className="ml-10">
            <div className="datepicker-label">
              <span>From:</span>
              <span>To:</span>
            </div>
            <Form.Item name="datePicker">
              <RangePicker
                onChange={(_date, dateString) => {
                  setDataRange(dateString);
                }}
                disabledDate={(current) => {
                  return current && current > moment().endOf("day");
                }}
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
                  filename="transactional feedback"
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
        dataSource={feedbackReport.list}
        columns={columns}
        scrollValue={1400}
        onPaginationChange={(page) => onPaginationChange(page)}
        currentPage={currentPage}
        loading={isLoading}
        showQuickJumper={true}
        defaultPageSize={feedbackReport.recordPerPage}
        totalRecordCount={feedbackReport.recordCount}
      />
      {actionModal === "update" && (
        <AddFeedbackModal
          visible={updateModalVisiblility}
          onSubmit={addUpdateComments}
          data={comments}
          onOKClick={(flag) => {
            setUpdateModalVisibility(flag);
            setActionModal("");
          }}
          onCancelClick={(flag) => {
            setUpdateModalVisibility(flag);
            setActionModal("");
          }}
          modalTitle="Add Comments"
          width={600}
        />
      )}
      {actionModal === "view" && (
        <ViewFeedbackModal
          visible={viewModalVisiblility}
          data={comments}
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
      )}
    </div>
  );
}
