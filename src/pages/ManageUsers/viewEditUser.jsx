import { Button, Modal, Space } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import { AppContext } from "context/globalContext";
import { useContext, useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";
import { useHistory } from "react-router-dom";
import viewUserReportService from "services/viewUserService";

const ViewUser = () => {
  const { setUpdateUserDetails } = useContext(AppContext);
  const [dataSource, setdataSource] = useState({});
  const [loading, setloading] = useState(false);
  const errorHandler = useErrorHandler();
  const history = useHistory();

  useEffect(() => {
    getViewUserList({ pageNumber: 1 });
    // eslint-disable-next-line
  }, []);

  const removeUser = async (filters) => {
    await viewUserReportService.deleteUser(filters);
    getViewUserList();
  };

  const confirmUserDelete = (userdetail = {}) => {
    Modal.confirm({
      title: "Do you want to Delete",
      content: `${userdetail?.fullName} ( ${userdetail?.userName})`,
      okText: "ok",
      cancelText: "Cancle",
      onOk: () => removeUser({ id: userdetail?.id }),
      // onCancel:
    });
  };
  const getViewUserList = async (filters) => {
    try {
      setloading(true);
      const data = await viewUserReportService.getViewUserList(filters);
      setdataSource({
        list: data.data ? data.data : [],
        recordCount: data.count ? data.count : 0,
        recordPerPage: data.recordPerPage ? data.recordPerPage : 0,
      });

      setloading(false);
    } catch (error) {
      setloading(false);
      errorHandler(error);
    }
  };

  const onPaginationChange = (page) => {
    const filters = {
      pageNumber: page,
    };

    getViewUserList(filters);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Action",
      key: "Action",
      render: (text, record, index) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setUpdateUserDetails({ flag: true, userData: record });
              history.push({
                pathname: "/jazz/update-user",
                state: { userData: record },
              });
            }}
          >
            Update
          </Button>
          <Button
            onClick={() => {
              confirmUserDelete(record);
            }}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <h3 className="mb-4">View User</h3>

      <ReportsViewTable
        scroll={1500}
        dataSource={dataSource.list}
        loading={loading}
        columns={columns}
        onPaginationChange={(page) => onPaginationChange(page)}
        showQuickJumper={true}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
        isPagination={false}
      />
    </>
  );
};
export default ViewUser;
