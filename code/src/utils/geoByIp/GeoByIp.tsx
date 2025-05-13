"use Client";
import React from "react";
import { getLocationBasedOnIp, getIp } from "./geobyip_funcs";

/**
 * Usage
 * <GeoByIp
        handleSuccess={(r) => {
          console.log('geo r is ', r);
        }}
        handleError={(r) => {
          console.log('geo err is ', r);
        }}
      />
 */
function GeoByIp({
  handleSuccess,
  handleError,
  setIp,
}: {
  handleSuccess: any;
  handleError: any;
  setIp: any;
}) {
  React.useEffect(() => {
    getLocationBasedOnIp(handleSuccess, handleError);
    getIp()
      .then((r) => {
        console.log("ip is ", r);
        setIp(r);
      })
      .catch((e) => {
        console.log("err is ", e.message);
      });
  }, [handleSuccess, handleError, setIp]);
  return null;
}

export default GeoByIp;
