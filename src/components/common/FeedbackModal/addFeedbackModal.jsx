import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import SelectDropdown from "../selectDropdown";
import { FeedbackStatus } from "pages/GeneralFeedback/generalFeedback";
const { TextArea } = Input;

const TOPIC_LISTS = [
  {
    key: "Voice Bundle/Bolt-on Activation",
    displayValue: "Voice Bundle/Bolt-on Activation",
  },
  {
    key: "Voice Bundle/Bolt-on DeActivation",
    displayValue: "Voice Bundle/Bolt-on DeActivation",
  },
  {
    key: "Voice Bundle/Bolton Issue in Activation",
    displayValue: "Voice Bundle/Bolton Issue in Activation",
  },
  {
    key: "Data Bundle/Bolt-on Activation",
    displayValue: "Data Bundle/Bolt-on Activation",
  },
  {
    key: "Data Bundle/Bolt-on Deactivation",
    displayValue: "Data Bundle/Bolt-on Deactivation",
  },
  { key: "Package Change", displayValue: "Package Change" },
  { key: "New Number - Activation", displayValue: "New Number - Activation" },
  { key: "Request not entertained", displayValue: "Request not entertained" },
  { key: "Feature not available", displayValue: "Feature not available" },
  {
    key: "VAS - Activation &amp; Deactivation",
    displayValue: "VAS - Activation &amp; Deactivation",
  },
  { key: "Customer Knowledge", displayValue: "Customer Knowledge" },
  { key: "Order Failure", displayValue: "Order Failure" },
  { key: "Order Status", displayValue: "Order Status" },
  { key: "Bill Correctness", displayValue: "Bill Correctness" },
  { key: "Bulk CDR Downloads", displayValue: "Bulk CDR Downloads" },
  { key: "Bulk Bill Downloads", displayValue: "Bulk Bill Downloads" },
  { key: "Change of SIM", displayValue: "Change of SIM" },
  { key: "Bulk SIM Change", displayValue: "Bulk SIM Change" },
  { key: "Bulk Ledger Download", displayValue: "Bulk Ledger Download" },
  {
    key: "Bulk Tax Certificates Download",
    displayValue: "Bulk Tax Certificates Download",
  },
  { key: "Bill Statement Summary", displayValue: "Bill Statement Summary" },
  { key: "Online Bill payment", displayValue: "Online Bill payment" },
  { key: "Payment not posted", displayValue: "Payment not posted" },
  { key: "Complaint Management", displayValue: "Complaint Management" },
  { key: "Service not Active", displayValue: "Service not Active" },
  { key: "Block on Stolen", displayValue: "Block on Stolen" },
  { key: "Voluntary Blocking", displayValue: "Voluntary Blocking" },
  { key: "Restoration Issue", displayValue: "Restoration Issue" },
  { key: "Feature is not working", displayValue: "Feature is not working" },
  { key: "Login Issue", displayValue: "Login Issue" },
  { key: "Data is missing", displayValue: "Data is missing" },
  { key: "Multiple Hierarchy", displayValue: "Multiple Hierarchy" },
  { key: "Incomplete Information", displayValue: "Incomplete Information" },
  { key: "Customer Suggestion", displayValue: "Customer Suggestion" },
];
export default function AddFeedbackModal({
  modalTitle,
  visible,
  width,
  onOKClick,
  onCancelClick,
  data,
  onSubmit,
}) {
  const defaultState = {
    id: null,
    operational_lov: "",
    operational_coments: "",
  };
  const [commentData, setCommentData] = useState(defaultState);
  const [contractDate, setcontractDate] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      // setcontractDate(
      //   data[0] && data[0].contacted_at ? data[0].contacted_at : ""
      // );
      const commentProps = {
        id: data && data[0] ? data[0].id : null,
        operational_lov: data && data[0] ? data[0].operational_lov : "",
        operational_coments: data && data[0] ? data[0].operational_coments : "",
        contacted_at: data && data[0] ? data[0].contacted_at : "",
        feedback_status: data && data[0] ? data[0].feedback_status : "",
      };
      setCommentData(commentProps);
      form.setFieldsValue({
        ...commentProps,
        contacted_at: "",
      });
      if (
        data &&
        data[0] &&
        data[0].contacted_at &&
        data[0].contacted_at !== "Invalid Date"
      ) {
        form.setFieldsValue({
          contacted_at: moment(data[0].contacted_at, "YYYY/MM/DD HH:mm:ss"),
        });
        setcontractDate(data[0].contacted_at);
      }
    }

    return () => {
      form.setFieldsValue({});
    };
    // eslint-disable-next-line
  }, [data]);

  return (
    <Modal
      maskTransitionName=""
      title={modalTitle}
      onOk={() => onOKClick(false)}
      onCancel={() => onCancelClick(false)}
      centered
      footer={null}
      width={width}
      visible={visible}
    >
      <Form
        form={form}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={(values) => {
          if (moment(contractDate) > moment.now()) {
            message.warning("Cannot select Future Date!");
            return;
          }
          onSubmit({ ...values, contacted_at: contractDate }, commentData.id);
        }}
      >
        <Form.Item
          rules={[{ required: true, message: "Select topic" }]}
          name="operational_lov"
          label="Select Operatinal lov"
        >
          <SelectDropdown items={TOPIC_LISTS} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Select status" }]}
          name="feedback_status"
          label="Feedback Status"
        >
          <SelectDropdown items={FeedbackStatus} />
        </Form.Item>
        <Form.Item name="contacted_at" label="Contacted At">
          <DatePicker
            defaultValue={moment("2015/01/01", "YYYY/MM/DD HH:mm:ss")}
            onChange={(_date, dateString) => {
              setcontractDate(dateString);
            }}
            showTime={true}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "Comment cannot be empty" }]}
          name="operational_coments"
          label="Remarks"
        >
          <TextArea
            rows={8}
            style={{
              resize: "none",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button size="middle" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

AddFeedbackModal.defaultProps = {
  visible: false,
  width: 1000,
};
