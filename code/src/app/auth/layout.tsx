import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login, Register, Forgot Password",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="auth-layout">{children}</div>;
}
