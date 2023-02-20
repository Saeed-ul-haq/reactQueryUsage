import React, { Fragment } from "react";
import { Form, Row, Button, Col, DatePicker, Tag } from "antd";
import moment from "moment";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
import SelectDropdown from "components/common/selectDropdown";

const { RangePicker } = DatePicker;

const columns = [
  {
    title: "User Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "IP",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Description",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Time Stamp",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Type",
    key: "tags",
    dataIndex: "tags",
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Col>
        <Button size="small">Reject</Button>
      </Col>
    ),
  },
];

const dataSource = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    time: "09/44",
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    time: "09/44",
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    time: "09/44",
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const STATUS_LIST = [
  { key: "general", displayValue: "General" },
  { key: "SOC", displayValue: "SOC" },
  { key: "CMET", displayValue: "CMET" },
];
const AuditLogs = () => {
  return (
    <Fragment>
      <h3 className="mb-4">Audit Logs</h3>
      <Form
        initialValues={{
          status: "general",
        }}
        layout="vertical"
      >
        <Row>
          <Col span={4}>
            <Form.Item name="status" label="Status">
              <SelectDropdown items={STATUS_LIST} />
            </Form.Item>
          </Col>

          <Col span={8} className="ml-10">
            <Form.Item name="dateRange">
              <div className="datepicker-label">
                <span>From:</span>
                <span>To:</span>
              </div>
              <RangePicker
                onChange={(_date, dateString) => {
                  console.log(dateString);
                }}
                disabledDate={(current) => {
                  return current && current > moment().endOf("day");
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label=" ">
              <Button>Submit</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ReportsViewTable
        scrollValue={900}
        dataSource={dataSource}
        columns={columns}
      />
    </Fragment>
  );
};
export default AuditLogs;
