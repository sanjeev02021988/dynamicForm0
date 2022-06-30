import { useState, useMemo, useCallback } from "react";
import { InputWrapper, Select } from "@mantine/core";
import Group from "./Group";
import { SizeMap } from "./consts";

const SelectWrapper = ({ fieldData, form }) => {
  const { id, label, description, required, options, size } = fieldData;
  const [value, setValue] = useState(fieldData.value);

  const optionMap = useMemo(
    () =>
      options.reduce((optionMap, option) => {
        optionMap[option.value] = option;
        return optionMap;
      }, {}),
    [options]
  );

  const groups = optionMap[value]?.renderGroups;

  const onSelect = useCallback(
    (value) => {
      setValue(value);
      const { onChange } = form?.getInputProps(id);
      onChange(value);
    },
    [form, id]
  );

  return (
    <>
      <InputWrapper
        id={id}
        required={required}
        label={label}
        description={description}
        className={"InputWrapper"}
        style={{ width: SizeMap[size] }}
      >
        <Select
          id={`field-${id}`}
          data={options}
          {...form?.getInputProps(id)}
          value={value}
          onChange={onSelect}
        />
      </InputWrapper>
      {groups?.map((group) => (
        <Group key={group.id} group={group} form={form} />
      ))}
    </>
  );
};

export default SelectWrapper;
