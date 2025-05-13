import React from "react";
import Button from "@mui/material/Button";

type Props = {
  variant?: "contained" | "outlined" | "text";
  label: string;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  handleClick?: () => void;
  disabled?: boolean;
  className?: string;
  color?:
    | "error"
    | "inherit"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning";
  customStyle?: any;
  customBtnStyle?: any;
};

const ButtonBox: React.FC<Readonly<Props>> = ({
  variant = "contained",
  label,
  fullWidth = true,
  type = "button",
  handleClick,
  disabled = false,
  className = "",
  color = "secondary",
  customStyle = {},
  customBtnStyle = {},
}) => {
  return (
    <div
      style={{
        marginBottom: "0.5rem",
        marginTop: "0.5rem",
        flex: 1,
        ...customStyle,
      }}
    >
      <Button
        variant={variant}
        fullWidth={fullWidth}
        type={type}
        onClick={() => {
          handleClick?.();
        }}
        disabled={disabled}
        className={className}
        color={color}
        sx={{ ...customBtnStyle }}
      >
        {label}
      </Button>
    </div>
  );
};

export default React.memo(ButtonBox);
