"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { logout } from "@/utils/parseMod/client/auth";

const ACTIVE_ROUTE = "active-nav-route";
const INACTIVE_ROUTE = "inactive-nav-route";

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <button
          onClick={async () => {
            await logout();
            signOut();
          }}
        >
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default function NavMenu() {
  const pathname = usePathname();
  console.log("pathname: ", pathname);
  return (
    <div style={{ marginTop: "200px" }}>
      <AuthButton />
      <hr className="my-4" />
      <ul>
        <Link href="/tmp/home">
          <li className={pathname === "/" ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
            Home
          </li>
        </Link>
        <Link href="/tmp/protected/home">
          <li
            className={
              pathname === "/tmp/protected/home" ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            Protected Route
          </li>
        </Link>
        <Link href="/tmp/serverAction">
          <li
            className={
              pathname === "/tmp/serverAction" ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            Server Action
          </li>
        </Link>
        <Link href="/tmp/apiFromClient">
          <li
            className={
              pathname === "/tmp/apiFromClient" ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            API From Client
          </li>
        </Link>
        <Link href="/tmp/apiFromServer">
          <li
            className={
              pathname === "/tmp/apiFromServer" ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            API From Server
          </li>
        </Link>
      </ul>
    </div>
  );
}
