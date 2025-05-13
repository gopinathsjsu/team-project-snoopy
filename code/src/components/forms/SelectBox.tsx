import React from "react";

import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SelectBoxTypes = {
  name: string;
  label: string;
  value: string;
  handleChange: (n: string, v: string) => void;
  options: ItemType[];
  helperText?: string;
  error?: boolean | string;
};
type ItemType = {
  label: string;
  value: string;
};
const SelectBox = ({
  name,
  label,
  value,
  handleChange = () => {
    return;
  },
  options = [],
  helperText,
  error = false,
}: SelectBoxTypes) => {
  let showError = false;
  let hT: string = helperText ?? "";
  if (typeof error === "string" || typeof error === "boolean") {
    showError = !!error;
    if (error) {
      hT = error.toString();
    }
  } else if (typeof error === "object") {
    showError = !!error[0];
    hT = error[0];
  }
  return (
    <div style={{ marginBottom: "10px" }}>
      <FormControl variant="standard" sx={{ minWidth: 120, width: "100%" }}>
        <InputLabel id={`${name}_id`}>{label}</InputLabel>
        <Select
          labelId={`${name}_label_id`}
          id={`${name}_id`}
          value={value}
          onChange={(e: SelectChangeEvent<string>) => {
            handleChange(e.target.name, e.target.value);
          }}
          label={label}
          error={showError}
          name={name}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options?.map((item: ItemType) => {
            return (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{hT}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default React.memo(SelectBox);
