import { getAxiosRequest, myAxiosServer } from "../myAxios";

// /locations/getUsersLocation.php?latitude=-67.57&longitude=68.12
export const get_users_location = async (lat: number, lng: number) => {
  const url = `/locations/getUsersLocation.php?latitude=${lat}&longitude=${lng}`;
  const response = await getAxiosRequest(myAxiosServer, url, -1);
  return response.data;
};

// /locations/putUsersLocation.php?latitude=-67.57&longitude=68.12
export const put_users_location = async (
  lat: number,
  lng: number,
  payload: any
) => {
  const url = `/locations/putUsersLocation.php?latitude=${lat}&longitude=${lng}`;
  const response = await myAxiosServer.post(url, payload);
  return response.data;
};

export const getLocation = async (handleSuccess: any, handleError: any) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      let location = null;
      if (lat && lng) {
        location = await get_users_location(lat, lng);
        if (!location) {
          const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
          const result = await getAxiosRequest(myAxiosServer, url, -1);
          if (result.status === 200) {
            location = await put_users_location(lat, lng, {
              ...result.data,
            });
          }
        }
      }

      handleSuccess({
        lat,
        lng,
        details: location,
      });
    }, handleError);
  }
};
