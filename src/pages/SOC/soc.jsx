import React, { Fragment, useEffect, useState } from "react";
import { Space, Col, Button } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SocService from "services/socService";
import { useErrorHandler } from "react-error-boundary";
import PopupViewTable from "components/common/popupViewTable";

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
    title: "Line Package",
    key: "line_package",
    dataIndex: "line_package",
  },
  {
    title: "Boltan",
    key: "boltan",
    dataIndex: "boltan",
  },
  {
    title: "Bundle",
    key: "bundle",
    dataIndex: "bundle",
  },
  {
    title: "Access Level",
    key: "access_level",
    dataIndex: "access_level",
  },
  {
    title: "Donor",
    key: "donor",
    dataIndex: "donor",
  },
  {
    title: "Connection",
    key: "connection_type",
    dataIndex: "connection_type",
  },
  {
    title: "Act Date",
    key: "act_date",
    dataIndex: "act_date",
  },
  {
    title: "IMSI",
    key: "imsi",
    dataIndex: "imsi",
  },
  {
    title: "IMSI Old",
    key: "imsi_old",
    dataIndex: "imsi_old",
  },
  {
    title: "Sim Price",
    key: "sim_price",
    dataIndex: "sim_price",
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
const WAIVER_DETAILS_COLUMN = [
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
];

const SOC = () => {
  const [visible, setVisble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simDetails, setSimDetails] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const errorHandler = useErrorHandler();

  //----------------Loading Data-------------------//
  useEffect(() => {
    getAllSocData();
    
    // eslint-disable-next-line
  }, []);
  //----------------Actions Functions -------------//
  const getAllSocData = async (page = 1) => {
    try {
      const data = await SocService.getSocReports(page);
      setLoading(true);
      setDataSource({
        list: data.data ? data.data : [],
        recordCount: data.count,
        recordPerPage: data.recordPerPage,
      });
      setLoading(false);
    } catch (error) {
      errorHandler(error);
      setLoading(false);
    }
  };
  const getSimOrderDetails = async (id) => {
    try {
      const data = await SocService.getSimOrderDetails(id);
      setLoading(true);
      const simDetail = {
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      };
      setColumnData(VIEW_ORDER_COLUMN);
      setSimDetails(simDetail);
      setVisble(true);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };

  const getRejectionDetails = async (id) => {
    try {
      const data = await SocService.getRejectedOrderDetails(id);
      setLoading(true);
      const rejectionDetail = {
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      };
      setColumnData(REJECT_DETAIL_COLUMN);
      setSimDetails(rejectionDetail);
      setVisble(true);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };
  const getWaiverDocuments = async (id) => {
    try {
      const data = await SocService.getWaiverDocuments(id);
      setLoading(true);
      const waiverDetails = {
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      };
      setColumnData(WAIVER_DETAILS_COLUMN);
      setSimDetails(waiverDetails);
      setVisble(true);
    } catch (error) {
      setLoading(false);
      errorHandler(error);
    }
  };

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
      title: "Sale Type",
      dataIndex: "sim_req_type",
      key: "sim_req_type",
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
        <Space size="small">
          <Col>
            <Button
              size="small"
              type="link"
              onClick={() => {
                getSimOrderDetails(record.id);
              }}
            >
              View Order Details
            </Button>
          </Col>
          <Col>
            <Button
              size="small"
              type="link"
              onClick={() => {
                getRejectionDetails(record.id);
              }}
            >
              View Rejection Details
            </Button>
          </Col>
          <Col>
            <Button
              size="small"
              type="link"
              block
              onClick={() => {
                getWaiverDocuments(record.id);
              }}
            >
              View Waiver Documents
            </Button>
          </Col>
          <Col>
            <Button size="small">Reject</Button>
          </Col>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h3 className="mb-4">SOC</h3>

      <ReportsViewTable
        scrollValue={1600}
        dataSource={dataSource.list}
        columns={columns}
        showQuickJumper={true}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
      />

      <PopupViewTable
        title="View Details"
        onOk={() => setVisble(false)}
        onCancel={() => setVisble(false)}
        centered
        modalWidth={1000}
        loading={loading}
        visible={visible}
        scrollValue={1800}
        dataSource={simDetails}
        quickJumper={true}
        columns={columnData}
      />

      {/* <PopupViewTable
        title="Rejection Details"
        onOk={() => setRejectionModalVisibilty(false)}
        onCancel={() => setRejectionModalVisibilty(false)}
        centered
        modalWidth={1000}
        visible={rejectionModalVisibilty}
        scrollValue={1800}
        dataSource={simDetails}
        quickJumper={false}
        columns={modalTableColumns}
      /> */}

      {/* <PopupViewTable
        title="Waiver Documents"
        onOk={() => setWaiverModalVisibilty(false)}
        onCancel={() => setWaiverModalVisibilty(false)}
        centered
        modalWidth={1000}
        visible={waiverModalVisibilty}
        scrollValue={1800}
        dataSource={simDetails}
        quickJumper={false}
        columns={modalTableColumns}
      /> */}
      {/* <Modal>
        <ReportsViewTable
          className="mt-5"
          showQuickJumper={true}
          defaultPageSize={simDetails.recordPerPage}
          totalRecordCount={simDetails.recordCount}
        />
      </Modal> */}

      {/* <Modal
        title="Rejection Details"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        centered
        width={1000}
        visible={visible}
      >
        <ReportsViewTable
          className="mt-5"
          scrollValue={1800}
          dataSource={simDetails.list}
          columns={modalTableColumns}
          showQuickJumper={true}
          defaultPageSize={simDetails.recordPerPage}
          totalRecordCount={simDetails.recordCount}
        />
      </Modal>

       */}
    </Fragment>
  );
};
export default SOC;
