import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const AlertBox = ({
  message,
  title,
  severity = "error",
}: {
  message?: string;
  title: string;
  severity?: "error" | "info" | "success" | "warning";
}) => {
  return (
    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
      <Alert severity={severity}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </div>
  );
};

export default AlertBox;
