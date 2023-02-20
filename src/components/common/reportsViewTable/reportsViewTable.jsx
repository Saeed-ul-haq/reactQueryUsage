import React from "react";
import { Table } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./styles.css";

export default function ReportsViewTable({
  scrollValue,
  dataSource,
  columns,
  onPaginationChange,
  showQuickJumper,
  defaultPageSize,
  totalRecordCount,
  handleChange,
  isPagination = true,
  scrollY,
  currentPage,
  loading,
  ...props
}) {
  console.log({ columns, dataSource });

  return (
    <Spin style={{ fontSize: 54 }} spinning={loading}>
      <Table
        className="table-striped-rows"
        size="middle"
        scroll={{ x: scrollValue, y: scrollY }}
        dataSource={dataSource}
        columns={columns}
        onChange={handleChange}
        pagination={
          isPagination
            ? {
                onChange: (page) => {
                  if (onPaginationChange) {
                    console.log(page);
                    onPaginationChange(page);
                  }
                },
                // showQuickJumper: {
                //   goButton: (
                //     <input
                //       type={"number"}
                //       placeholder="enter number"
                //       onBlur={(e) => {
                //         let { value } = e.target;
                //         if (value <= 0) return;
                //         alert(value);
                //         onPaginationChange(value);
                //       }}
                //     />
                //   ),
                // },
                // locale: { jump_to: "Your text" },
                defaultPageSize: defaultPageSize,
                showSizeChanger: false,
                total: totalRecordCount,
                current: currentPage,
                // pageSizeOptions: ["5", "10", "20"],
              }
            : isPagination
        }
        // pagination={isPagination}
        {...props}
      />
    </Spin>
  );
}

ReportsViewTable.defaultProps = {
  scrollValue: 1500,
  dataSource: [],
  loading: false,
  isPagination: true,
};
