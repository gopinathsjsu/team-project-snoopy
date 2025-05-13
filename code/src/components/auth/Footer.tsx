import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        fontSize: 14,
      }}
    >
      <div>
        <Link href="/auth/login" style={{ textDecoration: "none" }}>
          Login
        </Link>
      </div>
      <div>
        <Link href="/auth/register" style={{ textDecoration: "none" }}>
          Register
        </Link>
      </div>
    </div>
  );
}

export default Footer;
