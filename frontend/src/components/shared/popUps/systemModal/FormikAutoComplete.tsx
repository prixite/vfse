import { useEffect, useState } from "react";

import { TextField, Autocomplete } from "@mui/material";
import { FormikProps } from "formik";

import usePrevious from "@src/components/shared/customHooks/usePrevious";
import { FormState } from "@src/types/interfaces";

interface Props {
  isLoading: boolean;
  options: Record<string, unknown>;
  formik: FormikProps<FormState>;
  field: string;
  placeholder: string;
  parent?: string;
  optionLabel?: string;
}

const Loader = () => {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <p>Loading...</p>
    </div>
  );
};

export default function FormikAutoComplete({
  isLoading,
  options,
  formik,
  field,
  placeholder,
  parent,
  optionLabel = "name",
}: Props) {
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const preParent = usePrevious(formik.values[parent]);

  useEffect(() => {
    if (parent && formik.values[parent] !== preParent) {
      setValue(null);
      setInputValue("");
    }
  }, [formik.values[parent], parent]);

  useEffect(() => {
    const option = options.find((value) => value.id == formik.values[field]);
    if (option) {
      setValue(option);
    }
  }, [formik.values[field], options.length]);

  return (
    <Autocomplete
      sx={{ width: "100%" }}
      style={{ height: "58px" }}
      loading={isLoading}
      loadingText={<Loader />}
      options={options}
      autoHighlight
      getOptionLabel={(option) => (option ? option[optionLabel] : "")}
      value={value}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      onChange={(_, newValue) => {
        setValue(newValue);
        formik.setFieldTouched(field, true);
        formik.setFieldValue(field, newValue ? newValue.id : "");
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          error={formik.touched[field] && Boolean(formik.errors[field])}
          helperText={
            formik.touched[field] &&
            formik.errors[field] && (
              <span style={{ marginLeft: "-13px" }}>
                {formik.errors[field]}
              </span>
            )
          }
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
            placeholder: placeholder,
          }}
        />
      )}
    />
  );
}
