import Group from "./Group";
import { processFormConfig } from "./Utils";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";

// JSON
// Array: describes the layout of the fields
// Select: Contains dropdown options, where a option can contain array of fields to be shown if that option is selected.
// Layout Props: Contains if the field size: S, L, XL or display: INLINE, BLOCK

// CODE
// Field Wrapper: Will analyse layout props and will see if the dropdown options need to rendered.
// Will check for validations as well. Will collate the field values as well and pass it to parent.
// Form Wrapper: Will collect the field values from all the childrens.

// Can have a look at useForm and Form implementation of mantine
// group , multiple conditions, disable

function Form(props) {
  const { config } = props;
  const { groups, validate } = processFormConfig(config);
  const form = useForm({
    initialValues: {},
    validate
  });

  const onSubmit = useCallback(() => {
    console.log(form.values);
  }, [form]);

  return (
    <div>
      {groups.map((group) => (
        <Group key={group.id} group={group} form={form} />
      ))}
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}

export default Form;
