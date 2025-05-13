import md5 from "blueimp-md5";
const TIMEDIFF = 60 * 10;

export const getCache = (key: any, time_difference: number) => {
  const newKey = md5(key);
  const keyStr = `gc_${newKey}`;

  const tmp = localStorage.getItem(keyStr);

  if (tmp) {
    const obj = JSON.parse(tmp);
    if (obj.expiryRef === -1) {
      return obj;
    }
    const currentDate = new Date().getTime();
    const pastDate = obj?.expiryRef;
    if (pastDate) {
      const diff = currentDate - pastDate;
      const diffRound = Math.round(diff / 1000);
      const d = time_difference ?? TIMEDIFF;
      if (diffRound <= d) {
        // console.log("cache time not expired.");
        return obj;
      }
    }
  }

  return null;
};

export const saveCache = (key: any, content: any, expiryRef?: number) => {
  const newKey = md5(key);
  const keyStr = `gc_${newKey}`;

  localStorage.setItem(
    keyStr,
    JSON.stringify({
      expiryRef: expiryRef === -1 ? expiryRef : new Date().getTime(),
      data: content,
    })
  );

  return true;
};

export const clearCache = (key: any) => {
  const newKey = md5(key);
  const keyStr = `gc_${newKey}`;
  localStorage.removeItem(keyStr);
};
