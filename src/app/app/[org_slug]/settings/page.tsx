import TitleBar from "@/components/title-bar";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Settings | ${APP_NAME}`,
};

export default function SettignsPage() {
  return (
    <>
      <TitleBar title="Settings"></TitleBar>
      SettignsPage
    </>
  );
}
