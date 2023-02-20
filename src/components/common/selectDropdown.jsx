import React from "react";
import { Select } from "antd";

export default function SelectDropdown({ items, ...props }) {
  return (
    <Select {...props}>
      {items.map((elem, index) => {
        return (
          <Select.Option key={index + elem.key} value={elem.key}>
            {elem.displayValue}
          </Select.Option>
        );
      })}
    </Select>
  );
}
