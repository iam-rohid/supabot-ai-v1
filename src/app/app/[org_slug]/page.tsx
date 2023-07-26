import TitleBar from "@/components/title-bar";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Chatbots | ${APP_NAME}`,
};

export default function AppPage() {
  return (
    <>
      <TitleBar title="Chatbots">
        <Button>New Chatbot</Button>
      </TitleBar>
    </>
  );
}
