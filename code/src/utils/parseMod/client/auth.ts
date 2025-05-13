import Cookies from "js-cookie";
import Parse from "@/utils/parseCmp";
import config from "../../config";

export const login = async (username: string, password: string) => {
  const user = await Parse.User.logIn(username, password);
  return user;
};

export const getPrivateInfo = async ({ user }: { user: any }) => {
  try {
    const query = new Parse.Query("PrivateInfo");
    query.equalTo("user", user);
    const post = await query.first();

    return post;
  } catch (err) {
    console.log("err is ", err);
  }
};

export const privateInformation = async ({
  whatsapp,
  telegram,
  phone,
  user,
}: {
  whatsapp: string;
  telegram: string;
  phone: string;
  user: any;
}) => {
  try {
    let post = await getPrivateInfo({ user });
    if (post) {
      post.set("whatsapp", whatsapp);
      post.set("telegram", telegram);
      post.set("phone", phone);
      await post.save();
      return;
    }
    const Post = Parse.Object.extend("PrivateInfo");
    post = new Post();
    if (!post) {
      return;
    }
    console.log("post2 is ", post);
    post.set("user", user);
    post.set("whatsapp", whatsapp);
    post.set("telegram", telegram);
    post.set("phone", phone);
    console.log("post3 is ", post);

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user, true);
    acl.setWriteAccess(user, true);
    acl.setRoleReadAccess("administrator", true);
    acl.setRoleWriteAccess("administrator", true);
    post.setACL(acl);
    console.log("post4 is ", post);

    await post.save();
  } catch (err) {
    console.log("err is ", err);
  }
};

export const register = async ({
  username,
  password,
  email,
  name,
  profile_pic,
  whatsapp,
  telegram,
  phone,
}: {
  username: string;
  password: string;
  email: string;
  name: string;
  profile_pic: string;
  whatsapp: string;
  telegram: string;
  phone: string;
}) => {
  const user = new Parse.User();
  user.set("username", username);
  user.set("email", email);
  user.set("password", password);
  user.set("name", name);
  user.set("profile_pic", profile_pic);
  user.set("provider", "credentials");
  await user.signUp();
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(false);
  acl.setReadAccess(user, true);
  acl.setWriteAccess(user, true);
  acl.setRoleReadAccess("administrator", true);
  acl.setRoleWriteAccess("administrator", true);
  user.setACL(acl);
  await user.save();

  await privateInformation({ whatsapp, telegram, phone, user });

  return true;
};

export const updateProfile = async ({
  name,
  profile_pic,
  whatsapp,
  telegram,
  phone,
}: {
  name: any;
  profile_pic: any;
  whatsapp: string;
  telegram: string;
  phone: string;
}) => {
  const user = Parse.User.current();
  if (!user) {
    alert("please login first.");
    window.location.href = "/auth/login";
    return;
  }
  user.set("name", name);
  user.set("profile_pic", profile_pic);
  user.set("provider", "credentials");
  await user.save();
  await privateInformation({ whatsapp, telegram, phone, user });

  return user;
};

export const forgot = async (email: string) => {
  console.log("parse forgot");
  await Parse.User.requestPasswordReset(email);
  return true;
};

export const logout = async () => {
  await Parse.User.logOut();
  return true;
};

export const getCurrentUser = () => {
  return Parse.User.current();
};

export const clearSessionStorage = async (url?: string) => {
  localStorage.removeItem(`Parse/${config.appId}/currentUser`);
  Cookies.remove("session.sig", { path: "/" });
  Cookies.remove("session", { path: "/" });

  window.location.href = url ?? "/";
};

export const checkError = async ({
  err,
  url,
}: {
  err: Error;
  url?: string;
}) => {
  if ("code" in err && err.code === 209) {
    await clearSessionStorage(url);
  }
};
