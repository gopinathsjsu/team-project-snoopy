import { getAxiosRequest, myAxiosServer } from "../myAxios";

export const getIp = async () => {
  const url = "/ip.php";
  const response = await getAxiosRequest(myAxiosServer, url);
  return response.data;
};

// /locations/getUsersLocationByIp.php?latitude=-67.57&longitude=68.12
export const get_users_location_by_ip = async (ip: string) => {
  const url = `/locations/getUsersLocationByIp.php?ip=${ip}`;
  const response = await getAxiosRequest(myAxiosServer, url, -1);
  return response.data;
};

// /locations/putUsersLocation.php?latitude=-67.57&longitude=68.12
export const put_users_location_by_ip = async (ip: string, payload: any) => {
  const url = `/locations/putUsersLocationByIp.php?ip=${ip}`;
  const response = await myAxiosServer.post(url, payload);
  return response.data;
};

export const getLocationBasedOnIp = async (
  handleSuccess: any,
  handleError: any
) => {
  try {
    const ip = await getIp();
    if (!ip?.ip) {
      return null;
    }
    let location = await get_users_location_by_ip(ip?.ip);
    if (!location) {
      const url = `https://ipinfo.io/${ip?.ip}/json?token=1e8db72d9a0924`;
      const response = await getAxiosRequest(myAxiosServer, url, -1);
      location = await put_users_location_by_ip(ip?.ip, {
        ...response.data,
      });
    }
    handleSuccess(location);
  } catch (err: any) {
    handleError(err.message);
  }
};
