"use Client";
import React from "react";
import {
  saveCache,
  getCache,
  clearCache,
} from "@/utils/LocalStorageCache/cache_func";
import { getIp } from "./geobyip_funcs";

/**
 * Usage
 * <IP
        setIp={(r) => {
          console.log('geo r is ', r);
        }}
      />
 */
function Ip({ setIp }: { setIp: any }) {
  React.useEffect(() => {
    const obj = getCache("users_ip", 60 * 60 * 24);
    if (obj?.data) {
      console.log("ip is ", obj?.data);
      setIp(obj?.data);
      return;
    }
    getIp()
      .then((r) => {
        console.log("r ip is ", r);
        saveCache("users_ip", r?.ip);
        setIp(r?.ip);
      })
      .catch((e) => {
        console.log("err is ", e.message);
        clearCache("users_ip");
      });
  }, [setIp]);
  return null;
}

export default Ip;
