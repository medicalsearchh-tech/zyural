import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export interface OptionType {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  options: OptionType[];
  defaultValue?: OptionType;
  value?: OptionType;
  className?: string;
  placeholder?: string;
  modal?: boolean;
  disabled?: boolean; // Add this
  onChange?: (value: OptionType) => void;
}

const CustomSelect: React.FC<CustomDropdownProps> = ({
  options,
  defaultValue,
  value,
  className,
  placeholder,
  modal,
  disabled, // Add this
  onChange,
}) => {
  const getPopupContainer = modal
    ? () =>
        (document.getElementsByClassName('modal')[0] as HTMLElement) ||
        document.body
    : undefined;

  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      className={className}
      placeholder={placeholder ? placeholder : 'Select'}
      style={{ width: '100%' }}
      getPopupContainer={getPopupContainer}
      onChange={onChange}
      disabled={disabled} // Add this
      labelInValue
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;