import { useEffect, useState } from "react";

import { TextField, Autocomplete } from "@mui/material";
import { FormikProps } from "formik";

import { FormState } from "@src/components/shared/popUps/systemModalInterfaces/interfaces";

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
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState(null);

  useEffect(() => {
    if (parent && formik.touched[parent] && !formik.isSubmitting) {
      formik.setFieldValue(field, "");
      setValue(null);
      setInputValue("");
    }
  }, [
    formik.values[parent],
    formik.touched[parent],
    field,
    parent,
    formik.isSubmitting,
  ]);

  useEffect(() => {
    const option = options.find((value) => value.id == formik.values[field]);
    if (option) {
      setValue(option);
    }
  }, [formik.values[field], options.length]);

  return (
    <Autocomplete
      sx={{ width: "100%" }}
      style={{ height: "48px" }}
      loading={isLoading}
      loadingText={<Loader />}
      options={options}
      autoHighlight
      getOptionLabel={(option) => (option ? option[optionLabel] : "")}
      value={value}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
          helperText={formik.touched[field] && formik.errors[field]}
          inputProps={{
            ...params.inputProps,
            autoComplete: "password", // disable autocomplete and autofill
            placeholder: placeholder,
          }}
        />
      )}
    />
  );
}
