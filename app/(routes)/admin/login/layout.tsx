import React from "react";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata = {
  title: "Admin Login - Choufli Hal Hackathon",
  description: "Login to access the admin dashboard",
};
