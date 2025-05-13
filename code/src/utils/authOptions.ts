import { NextAuthOptions } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Parse from "@/utils/parseSer";
import { login } from "@/utils/parseMod/server/auth";
import { cookies } from "next/headers";
import { handleError } from "@/utils/funcs";

async function createCookie(name: string, value: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
}

type credentialsType = Record<"username" | "password", string> | undefined;

export const authOptions: NextAuthOptions = {
  // session: {
  //   strategy: "jwt",
  // },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: credentialsType): Promise<{
        id: string;
        name: string;
        email: string;
        username: string;
      } | null> {
        try {
          const res = await login(
            credentials?.username ?? "",
            credentials?.password ?? ""
          );
          await createCookie("sessionToken_", res.get("sessionToken"));
          await createCookie("user_", res.id);
          await createCookie("provider_", "credentials");
          return res
            ? {
                id: res.id,
                name: res.get("name"),
                email: res.get("email"),
                username: res.get("username"),
              }
            : null;
        } catch (err: unknown) {
          const errMessage: string = await handleError(err);
          console.log("CredentialsProvider err: ", errMessage);
          return null;
        }
      },
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //   clientSecret: process.env.GOOGLE_SECRET ?? "",
    //   authorization: {
    //     params: {
    //       scope: [
    //         "openid",
    //         "https://www.googleapis.com/auth/userinfo.email",
    //         "https://www.googleapis.com/auth/userinfo.profile",
    //         "https://www.googleapis.com/auth/youtube",
    //         "https://www.googleapis.com/auth/youtube.upload",
    //         "https://www.googleapis.com/auth/drive.file",
    //       ].join(" "),
    //     },
    //   },
    // }),
  ],
  callbacks: {
    redirect: async ({ baseUrl }) => {
      // Allows relative callback URLs
      // if (url.startsWith("/")) {
      //   console.log("one: ", `${baseUrl}${url}`);
      //   return `${baseUrl}${url}`;
      // }
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) {
      //   console.log("two: ", url);
      //   return url;
      // }
      return baseUrl;
    },
    signIn: async ({ user, account, profile }: any): Promise<boolean> => {
      if (account.provider === "credentials") {
        return true;
      }
      try {
        const myAuthData: {
          id: string;
          name: string;
          email: string;
          profile_pic: string;
          username: string;
          access_token: string;
          id_token: string;
        } = {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_pic: user.image,
          username: user.email,
          access_token: account.access_token,
          id_token: account.id_token,
        };
        let u = null;
        const query = new Parse.Query(Parse.User);
        query.equalTo("email", user.email);
        u = await query.first({ useMasterKey: true });

        if (!u) {
          u = new Parse.User();
        }
        await u.linkWith(
          account.provider,
          { authData: myAuthData },
          { useMasterKey: true }
        );
        await createCookie("sessionToken_", u.get("sessionToken"));
        await createCookie("user_", u.id);
        await createCookie("provider_", account.provider);
        u.set("username", user.email);
        u.set("name", user.name);
        u.set("email", user.email);
        u.set("profile_pic", user.image);
        u.set("gid", user.id);
        u.set("provider", account.provider);
        u.set("emailVerified", profile.email_verified); // does not work

        const acl = new Parse.ACL();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(false);
        acl.setReadAccess(u, true);
        acl.setWriteAccess(u, true);
        acl.setRoleReadAccess("administrator", true);
        acl.setRoleWriteAccess("administrator", true);
        u.setACL(acl);
        await u.save(null, { useMasterKey: true });
        return true;
      } catch (err: unknown) {
        const errMessage: string = await handleError(err);
        console.log(errMessage);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
