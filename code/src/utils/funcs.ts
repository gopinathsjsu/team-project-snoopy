import { checkError } from "@/utils/parseMod/client/auth";
import { sendMail } from "@/lib/send-mail";

export const handleError = async (
  err: unknown,
  url?: string
): Promise<string> => {
  let errMessage: string = "";
  if (typeof err === "string") {
    errMessage = err;
  } else if (err instanceof Error && "code" in err) {
    checkError({ err, url });
    errMessage = err.message;
  } else if (err instanceof Error) {
    errMessage = err.message;
  }

  return errMessage;
};

export const radiansTo = (latitude: number, longitude: number, point: any) => {
  const d2r = Math.PI / 180.0;
  const lat1rad = latitude * d2r;
  const long1rad = longitude * d2r;
  const lat2rad = point.latitude * d2r;
  const long2rad = point.longitude * d2r;
  const sinDeltaLatDiv2 = Math.sin((lat1rad - lat2rad) / 2);
  const sinDeltaLongDiv2 = Math.sin((long1rad - long2rad) / 2); // Square of half the straight line chord distance between both points.

  let a =
    sinDeltaLatDiv2 * sinDeltaLatDiv2 +
    Math.cos(lat1rad) * Math.cos(lat2rad) * sinDeltaLongDiv2 * sinDeltaLongDiv2;
  a = Math.min(1.0, a);
  return 2 * Math.asin(Math.sqrt(a));
};

export const milesTo = (latitude: number, longitude: number, point: any) => {
  console.log("l:", latitude, ", ", latitude, ", ", point);
  return radiansTo(latitude, longitude, point) * 3958.8;
};

export const kilometersTo = (
  latitude: number,
  longitude: number,
  point: any
) => {
  return radiansTo(latitude, longitude, point) * 6371.0;
};

export const mail = async (data: any) => {
  if (!data.email) {
    throw new Error("email is missing.");
  }
  if (!data.name) {
    throw new Error("name is missing.");
  }
  if (!data.subject) {
    throw new Error("subject is missing.");
  }
  if (!data.message) {
    throw new Error("message is missing.");
  }

  const message = `From Email: ${data.email}
  From Name: ${data.name}
  From Subject: ${data.subject}
  From message: ${data.message}`;

  const info = await sendMail({
    email: "admin@mkgalaxy.com",
    sendTo: "manishkk74@gmail.com",
    subject: `${data.name} has inquired about Online Tutor`,
    text: message ?? "",
    html: "",
  });
  return info;
};

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getRandomBetween3And5 = () => {
  return Math.random() * (5.0 - 3.0) + 3.0;
};

export const getRandomBetween100And5000 = () => {
  return Math.round(Math.random() * (5000 - 100) + 100);
};

export const getRandomBetween2And30 = () => {
  return Math.round(Math.random() * (30 - 2) + 2);
};
