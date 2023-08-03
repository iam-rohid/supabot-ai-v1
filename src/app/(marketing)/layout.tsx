import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Header from "./header";

export const metadata: Metadata = {
  title: `Welcome to ${APP_NAME}`,
};

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
