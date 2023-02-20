import React, { Fragment, useState, useEffect } from "react";
import { Space, Row, Col, Button, Modal, Form, Input } from "antd";
import SelectDropdown from "components/common/selectDropdown";
import { DownloadOutlined } from "@ant-design/icons";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import cmetService from "services/cmetService";
import { useErrorHandler } from "react-error-boundary";

const VIEW_ORDER_COLUMN = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Request Id",
    dataIndex: "request_id",
    key: "request_id",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Line MSISDN",
    dataIndex: "line_msidn",
    key: "line_msidn",
  },
  {
    title: "CNIC",
    dataIndex: "cnic",
    key: "cnic",
  },
  {
    title: "CNIC Issuance Date",
    key: "cnic_issuance_date",
    dataIndex: "cnic_issuance_date",
  },
  {
    title: "Waiver Required Amount",
    key: "amount",
    dataIndex: "amount",
  },
];

const REJECT_DETAIL_COLUMN = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Order No",
    dataIndex: "orderNumber",
    key: "orderNumber",
  },
  {
    title: "Rejected By",
    dataIndex: "rejectedBy",
    key: "rejectedBy",
  },
  {
    title: "Rejected Reason",
    dataIndex: "rejectedReason",
    key: "rejectedReason",
  },
  {
    title: "Remarks",
    dataIndex: "remarks",
    key: "remarks",
  },
  {
    title: "Rejected at",
    dataIndex: "rejected_at",
    key: "rejected_at",
  },
  {
    title: "POC Remarks",
    dataIndex: "poc_Remarks",
    key: "poc_Remarks",
  },
  {
    title: "POC Actions",
    dataIndex: "poc_Action",
    key: "poc_Action",
  },
];

const CMET = () => {
  const [dataSource, setDataSource] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const errorHandler = useErrorHandler();
  const [cMetDetails, setcMetDetails] = useState([]);
  const { TextArea } = Input;

  const WAIVER_DOCUMENT_COLUMN = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Order No",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Document Name",
      dataIndex: "doc_name",
      key: "doc_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Row>
          <Col>
            <Button type="primary" size="small" icon={<DownloadOutlined />} />
          </Col>
        </Row>
      ),
    },
  ];

  //-------------------Getting INITIAL DATA----------------//

  useEffect(() => {
    getAllCmetData();
    // eslint-disable-next-line
  }, []);

  const getAllCmetData = async (page = 1) => {
    try {
      const data = await cmetService.getAllCmetData(page);

      setLoading(true);
      setDataSource({
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };

  //---------------ACTIONS FUNCTIONS----------------------//

  const viewOrderDetail = async (id) => {
    try {
      const data = await cmetService.viewOrderDetail(id);
      setColumnData(VIEW_ORDER_COLUMN);
      setcMetDetails(data.data);
    } catch (error) {
      errorHandler(error);
    }
    setVisible(true);
  };
  const viewRejectionDetail = async (id) => {
    try {
      const data = await cmetService.viewRejectionDetail(id);
      setColumnData(REJECT_DETAIL_COLUMN);
      setcMetDetails(data.data);
    } catch (error) {
      errorHandler(error);
    }
    setVisible(true);
  };
  const viewWaiverDocument = async (id) => {
    try {
      const data = await cmetService.getWaiverDocuments(id);
      setColumnData(WAIVER_DOCUMENT_COLUMN);
      setcMetDetails(data.data);
    } catch (error) {
      errorHandler(error);
    }
    setVisible(true);
  };
  const openModal = () => {
    setIsModalVisible(true);
  };
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
    },
    {
      title: "Wavier Required Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Initial Status",
      dataIndex: "initial_status",
      key: "initial_status",
    },
    {
      title: "Ceated At",
      key: "created_at",
      dataIndex: "created_at",
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Row>
          <Space size="large">
            <Col>
              <SelectDropdown
                size="small"
                value="Please Select Action"
                items={[
                  { key: "accept", displayValue: "Accept" },
                  { key: "reject", displayValue: "Reject" },
                ]}
                onChange={(value) => (value === "reject" ? openModal() : "")}
              />
            </Col>
            <Col>
              <Button
                type="link"
                size="small"
                onClick={() => viewOrderDetail(record.id)}
              >
                View Order Details
              </Button>
            </Col>
            <Col>
              <Button
                type="link"
                size="small"
                onClick={() => viewRejectionDetail(record.id)}
              >
                View Rejection Details
              </Button>
            </Col>
            <Col>
              <Button
                type="link"
                size="small"
                onClick={() => viewWaiverDocument(record.id)}
              >
                View Waiver Documents
              </Button>
            </Col>
          </Space>
        </Row>
      ),
    },
  ];
  const [columnData, setColumnData] = useState(columns);
  const [form] = Form.useForm();

  return (
    <Fragment>
      <h3 className="mb-4">CMET</h3>
      <ReportsViewTable
        scrollValue={1600}
        dataSource={dataSource.list}
        columns={columns}
        showQuickJumper={true}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
      />
      <Modal
        maskTransitionName=""
        title="View Details"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        centered
        width={1000}
        visible={visible}
      >
        <ReportsViewTable
          scrollValue={1000}
          dataSource={cMetDetails}
          columns={columnData}
          loading={loading}
          showQuickJumper={true}
          defaultPageSize={dataSource.recordPerPage}
          totalRecordCount={dataSource.recordCount}
        />
      </Modal>
      <Modal //-------------------REJECTION_FEEDBACK_MODAL-------------------//
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        centered
        width={700}
        visible={isModalVisible}
      >
        <Fragment>
          <Form
            form={form}
            initialValues={{
              selectedstatus: "",
              remarks: "",
            }}
            onFinish={(values) => {
              const data = {
                selectedstatus: values.selectedstatus,
                remarks: values.remarks,
              };
              console.log(data)
            
            }}
          >
            <Row>
              <Col className="ml-10" span={12}>
                <Form.Item
                  name="selectedstatus"
                  label="Select Rejection Reason"
                >
                  {/* <p>Select Rejection Reason:</p> */}
                  <SelectDropdown
                    items={[
                      { key: "", displayValue: "Please Choose One" },
                      {
                        key: "incomplete_doc",
                        displayValue: "Incomplete Document",
                      },
                      {
                        key: "waiver_rej_dec",
                        displayValue: "Waiver Rejection Declined",
                      },
                      { key: "others", displayValue: "Others..." },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="ml-10" span={24}>
                <p>Remarks:</p>
                <Form.Item name="remarks">
                  <TextArea rows={12} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="ml-10">
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </Fragment>
      </Modal>
    </Fragment>
  );
};
export default CMET;
