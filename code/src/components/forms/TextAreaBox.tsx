import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface Props {
  name: string;
  label: string;
  value: string;
  handleChange: (n: string, v: string) => void;
  handleKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  handleBlur?: (n: string, v: string) => void;
  disabled?: boolean;
  type?: string;
  helperText?: string;
  error?: string;
  start?: string;
  end?: string;
  maxRows?: number;
  htmlInputs?: any;
}

const TextAreaBox: React.FC<Readonly<Props>> = ({
  name,
  label,
  value,
  handleChange,
  handleKeyDown,
  handleBlur,
  disabled,
  type = "text",
  helperText,
  error,
  start,
  end,
  maxRows,
  htmlInputs,
}) => {
  let showError = false;
  let hT = helperText;
  if (typeof error === "string" || typeof error === "boolean") {
    showError = !!error;
    if (error) {
      hT = error;
    }
  } else if (typeof error === "object") {
    showError = !!error[0];
    hT = error[0];
  }
  return (
    <div style={{ marginBottom: "20px", marginTop: "20px" }}>
      <TextField
        sx={{ boxShadow: "none" }}
        fullWidth
        type={type}
        label={label}
        name={name}
        value={value}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={maxRows}
        onChange={(e) => {
          handleChange?.(e.target.name, e.target.value);
        }}
        onBlur={(e) => {
          handleBlur?.(e.target.name, e.target.value);
        }}
        disabled={disabled}
        helperText={hT}
        error={showError}
        slotProps={{
          input: {
            startAdornment: start ? (
              <InputAdornment position="start">{start}</InputAdornment>
            ) : null,
            endAdornment: end ? (
              <InputAdornment position="end">{end}</InputAdornment>
            ) : null,
          },
          htmlInput: { ...htmlInputs },
        }}
      />
    </div>
  );
};

export default React.memo(TextAreaBox);
