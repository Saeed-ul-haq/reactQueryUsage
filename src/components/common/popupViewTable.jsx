import React from "react";
import { Modal } from "antd";
import ReportsViewTable from "components/common/reportsViewTable/reportsViewTable";
export default function PopupViewTable({
  title,
  onOk,
  onCancel,
  visible,
  dataSource,
  modalWidth,
  scrollValue,
  quickJumper,
  columns,
}) {
  return (
    <Modal
      maskTransitionName=""
      title={title}
      onOk={() => onOk(false)}
      onCancel={() => onCancel(false)}
      centered
      width={modalWidth}
      visible={visible}
    >
      <ReportsViewTable
        className="mt-5"
        scrollValue={scrollValue}
        dataSource={dataSource.list}
        columns={columns}
        showQuickJumper={quickJumper}
        defaultPageSize={dataSource.recordPerPage}
        totalRecordCount={dataSource.recordCount}
      />
    </Modal>
  );
}
