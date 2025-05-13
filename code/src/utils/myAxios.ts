import axios from "axios";
import md5 from "blueimp-md5";

// store data here
const TIMEDIFF = 60 * 10;
const cache: any = {};

export const myAxios = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export const myAxiosServer = axios.create({
  baseURL: "https://parseserver.us/api/", // 'http://local.example.com/api/',
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export const getAxiosRequest = async (
  axiosMod: any,
  url: string,
  expiryRef?: number
) => {
  const key = md5(url);
  const keyStr = `cache_${key}`;

  // check if localstorage exists for cache
  if (!cache[key]) {
    const tmp = localStorage.getItem(keyStr);
    if (tmp) {
      cache[key] = JSON.parse(tmp);
    }
  }

  // return cache data if expired is -1
  if (expiryRef === -1 && cache[key]) {
    return cache[key];
  }

  const currentDate = new Date().getTime();
  const pastDate = cache[key]?.expiryRef;
  if (pastDate) {
    const diff = currentDate - pastDate;
    const diffRound = Math.round(diff / 1000);
    if (diffRound <= TIMEDIFF) {
      // cache time not expired, return it
      // console.log('cache time not expired.');
      return cache[key];
    }
  }

  if (!cache[key]) {
    console.log("fetch real data for url: ", url);
    const response = await axiosMod.get(url);
    cache[key] = { expiryRef: new Date().getTime(), data: response.data, url };
    localStorage.setItem(keyStr, JSON.stringify(cache[key]));
    return response;
  }

  return cache[key];
};
