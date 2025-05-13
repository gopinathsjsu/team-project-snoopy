import Parse from "@/utils/parseSer";
import { mail } from "@/utils/funcs";
import config from "@/utils/config";

export const login = async (username: string, password: string) => {
  const user = await Parse.User.logIn(username, password);
  return user;
};

export const sendUserEmail = async ({
  userId,
  email,
  name,
  fromUser,
  message,
  files,
}: {
  userId: string;
  email: string;
  name: string;
  fromUser: string;
  message: string;
  files: any[];
}) => {
  const query = new Parse.Query(Parse.User);
  query.equalTo("objectId", userId);
  const u = await query.first({ useMasterKey: true });

  const data = {
    email,
    sendTo: u?.get("email"),
    subject: `Message from ${name} on ${config.SITE_NAME}`,
    text: message,
    html: "",
    fromUser,
    files,
  };
  await mail(data);
  return { success: 1 };
};
