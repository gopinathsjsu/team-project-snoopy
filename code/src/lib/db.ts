import md5 from "blueimp-md5";
import { getFile, saveFile } from "./CacheDb";

export const TIMEDIFF = 60 * 10;

export const query = async (
  db: any,
  sql: string,
  params: any[],
  time_difference?: number
) => {
  if (!db) {
    return null;
  }
  const timeDiffNew =
    time_difference && time_difference >= 0 ? time_difference : TIMEDIFF;
  const file = md5(sql + JSON.stringify(params));
  const content = await getFile(file);
  if (content) {
    const pastDate = content.expiryRef;
    const currentDate = new Date().getTime();
    // if pastdate is found, that means data is in cache
    if (pastDate) {
      const diff = currentDate - pastDate;
      const diffRound = Math.round(diff / 1000);
      // console.log(
      //   "get content diff ",
      //   diffRound,
      //   ", timeDiffNew: ",
      //   timeDiffNew
      // );
      // if expiryRef is crossed time limit then we don't need data from cache, else we need it.
      if (diffRound <= timeDiffNew) {
        // cache time not expired, return it
        // console.log("get content cache time not expired, return it: ", file);
        return content.data;
      }
    }
  }

  const [result] = await db.query(sql, params);

  // console.log("saving content: ", result);
  // console.log("saving content rest: ", rest);
  await saveFile(
    file,
    JSON.stringify({
      expiryRef: new Date().getTime(),
      data: result,
      sql,
      params,
    })
  );

  return result;
};
