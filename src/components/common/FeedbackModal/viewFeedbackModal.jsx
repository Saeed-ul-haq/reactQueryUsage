import { DatePicker, Input, Modal, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { TextArea } = Input;
export default function ViewFeedbackModal({
  modalTitle,
  visible,
  onOKClick,
  onCancelClick,
  width,
  data,
}) {
  const defaultState = {
    id: null,
    operational_lov: "",
    operational_coments: "",
  };
  const [commentData, setCommentData] = useState(defaultState);

  useEffect(() => {
    if (data) {
      setCommentData({
        id: data && data[0] ? data[0].id : null,
        operational_lov: data && data[0] ? data[0].operational_lov : "",
        operational_coments: data && data[0] ? data[0].operational_coments : "",
        contacted_at: data && data[0] ? data[0].contacted_at : "",
        feedback_status: data && data[0] ? data[0].feedback_status : "",
      });
    }
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
      <Row>
        <label htmlFor="operational lov">Operation lov</label>
        <Input
          className="mb-3"
          value={commentData.operational_lov}
          readOnly={true}
        />
        <label htmlFor="Feedback Status">Feedback Status</label>

        <Input
          className="mb-3"
          value={commentData.feedback_status}
          readOnly={true}
        />
        <label htmlFor="Contacted At">Contacted At</label>
        <div style={{ width: "100%" }}>
          <DatePicker
            value={
              commentData.contacted_at
                ? moment(commentData.contacted_at, "YYYY/MM/DD HH:mm:ss")
                : ""
            }
            disabled={true}
            showTime={true}
          />
        </div>
        <label htmlFor="Remarks">Remarks</label>
        <TextArea
          className="mb-5"
          placeholder="Remarks"
          value={commentData.operational_coments}
          rows={8}
          style={{
            resize: "none",
          }}
          readOnly={true}
        />
      </Row>
    </Modal>
  );
}

ViewFeedbackModal.defaultProps = {
  visible: false,
  width: 1000,
};
