import { Fragment, useEffect, useState, useContext } from "react";
import { CSVLink } from "react-csv";
import { useErrorHandler } from "react-error-boundary";
import ProfileInfoReports from "services/profileInfoService";
import allReports from "services/bulkDownloadService";
import { AppContext } from "context/globalContext";

import { Button, Col, Form, Input, Row, message } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import { isEmpty } from "lodash";

const csvHeader = [
  {
    label: "Name",
    key: "firstName",
  },
  {
    label: "MSISDN",
    key: "msisdn",
  },
  {
    label: "Custome Reference",
    key: "customerReference",
  },
  {
    label: "CEO Name",
    key: "ceoName",
  },
  {
    label: "CEO Primary No",
    key: "ceoPrimaryContactNumber",
  },
  {
    label: "CEO Other No",
    key: "ceoOtherContactNumber",
  },
  {
    label: "CEO Primary Email",
    key: "ceoPrimaryEmail",
  },
  {
    label: "NTN Document",
    key: "ntnDocument",
  },
  {
    label: "LOV Document 1",
    key: "lov1Document",
  },
  {
    label: "LOV Document 2",
    key: "lov2Document",
  },
  {
    label: "Company Type",
    key: "companyType",
  },
  {
    label: "Company Type Updated At",
    key: "companyTypeUpdatedAt",
  },
  {
    label: "Bussiness Industry",
    key: "businessIndustry",
  },
  {
    label: "Bussiness Industry Updated At",
    key: "businessIndustryUpdatedAt",
  },
];

const LoginReport = () => {
  const [profileInfoReports, setLoginReports] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const errorHandler = useErrorHandler();
  const { globalState } = useContext(AppContext);

  useEffect(() => {
    getProfileInfoReports({
      data: {
        storeId: "1",
        msisdn: "",
        customerRefNumber: "",
      },
      pageNumber: 1,
    });
    // eslint-disable-next-line
  }, []);
  const getProfileInfoReports = async (filters) => {
    try {
      setIsLoading(true);
      const data = await ProfileInfoReports.getAllProfileInfo(filters);
      setLoginReports({
        list: data,
        recordCount: data?.length,
      });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      errorHandler(err);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "MSISDN",
      dataIndex: "msisdn",
      key: "msisdn",
    },
    {
      title: "Custome Reference",
      dataIndex: "customerReference",
      key: "customerReference",
    },
    {
      title: "CEO Name",
      dataIndex: "ceoName",
      key: "ceoName",
    },
    {
      title: "CEO Primary No ",
      dataIndex: "ceoPrimaryContactNumber",
      key: "ceoPrimaryContactNumber",
    },
    {
      title: "CEO Other No ",
      dataIndex: "ceoOtherContactNumber",
      key: "ceoOtherContactNumber",
    },
    {
      title: "CEO Primary Email ",
      dataIndex: "ceoPrimaryEmail",
      key: "ceoPrimaryEmail",
    },
    {
      title: "NTN Document ",
      dataIndex: "ntnDocument",
      key: "ntnDocument",
      render: (data) =>
        !isEmpty(data) && (
          <a target="_blank" rel="noreferrer" href={data}>{` NTN Document`}</a>
        ),
    },
    {
      title: "LOV Document 1 ",
      dataIndex: "lov1Document",
      key: "lov1Document",
      render: (lov1Document) =>
        !isEmpty(lov1Document) && (
          <a
            target="_blank"
            rel="noreferrer"
            href={lov1Document}
          >{` View LOV Document 1`}</a>
        ),
    },
    {
      title: "LOV Document 2 ",
      dataIndex: "lov2Document",
      key: "lov2Document",
      render: (lov1Document2) =>
        !isEmpty(lov1Document2) && (
          <a
            target="_blank"
            rel="noreferrer"
            href={lov1Document2}
          >{` View LOV Document 2`}</a>
        ),
    },
    {
      title: "Company Type ",
      dataIndex: "companyType",
      key: "companyType",
    },
    {
      title: "Company Type Updated At ",
      dataIndex: "companyTypeUpdatedAt",
      key: "companyTypeUpdatedAt",
      sorter: {
        compare: (a, b) =>
          a["companyTypeUpdatedAt"] - b["companyTypeUpdatedAt"],
        multiple: 2,
      },
    },
    {
      title: "Bussiness Industry ",
      dataIndex: "businessIndustry",
      key: "businessIndustry",
    },
    {
      title: "Bussiness Industry Updated At ",
      dataIndex: "businessIndustryUpdatedAt",
      key: "businessIndustryUpdatedAt",
    },
  ];

  const downloadAllReports = async () => {
    const formData = form.getFieldValue();

    const data = {
      storeId: "1",
      msisdn: formData.msisdn,
      customerRefNumber: "",
    };
    const headers = {
      useCase: "Profile_View",
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
    <Fragment>
      <h3 className="mb-4">Profile View</h3>
      <Form
        labelCol={{ span: 30 }}
        wrapperCol={{ span: 30 }}
        layout="vertical"
        autoComplete="off"
        form={form}
        onFinish={(values) => {
          try {
            let reportFilter = {
              data: {
                storeId: "1",
                msisdn: values.msisdn,
                customerRefNumber: "",
              },
            };
            getProfileInfoReports(reportFilter);
          } catch (err) {
            errorHandler(err);
          }
        }}
        initialValues={{
          msisdn: "",
        }}
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
              label="MSISDN"
              name="msisdn"
            >
              <Input
                autoComplete="off"
                maxLength={12}
                minLength={12}
                placeholder="92300xxxxxxx"
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
              <Button>Reset</Button>
            </Form.Item>
          </Col>
          <Col className="ml-10">
            <Form.Item label=" ">
              <Button
                disabled={
                  profileInfoReports.recordCount &&
                  profileInfoReports.recordCount.length > 0
                }
              >
                <CSVLink
                  filename={"ProfileInfo.csv"}
                  headers={csvHeader}
                  data={profileInfoReports.list ? profileInfoReports.list : []}
                >
                  Download Excel
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
        scrollValue={2500}
        loading={isLoading}
        dataSource={profileInfoReports.list}
        columns={columns}
        isPagination={false}
      />
    </Fragment>
  );
};
export default LoginReport;
