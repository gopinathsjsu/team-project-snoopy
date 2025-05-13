"use client";
import React from "react";
import Parse from "@/utils/parseCmp";
import { useRouter } from "next/navigation";

function WrapLoggedIn({ children }: { children: any }) {
  const user = Parse.User.current();
  const { push } = useRouter();

  React.useEffect(() => {
    if (!user) {
      push("/auth/login");
    }
  }, [user, push]);
  if (!user) {
    return null;
  }
  return children;
}

export default WrapLoggedIn;
