import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorization",
};

type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full flex md:items-center justify-center">{children}</div>
  );
};

export default AuthLayout;