"use Client";
import React from "react";
import { getLocation } from "./geo_funcs";

/**
 * Usage
 * <Geo
        handleSuccess={(r) => {
          console.log('geo r is ', r);
        }}
        handleError={(r) => {
          console.log('geo err is ', r);
        }}
      />
 */
function Geo({
  handleSuccess,
  handleError,
}: {
  handleSuccess: any;
  handleError: any;
}) {
  React.useEffect(() => {
    getLocation(handleSuccess, handleError);
  }, [handleSuccess, handleError]);
  return null;
}

export default Geo;
