import moment from "moment";
import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function DateRangePicker({ ...props }) {
  return (
    <RangePicker
      allowClear={false}
      defaultValue={[
        moment(new Date(), "YYYY-MM-DD"),
        moment(new Date(), "YYYY-MM-DD"),
      ]}
      disabledDate={(current) => {
        return current && current > moment().endOf("day");
      }}
      {...props}
    />
  );
}
