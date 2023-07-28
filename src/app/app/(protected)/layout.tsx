import { ReactNode } from "react";
import ChatbotsProvider from "@/components/chatbots-provider";
import AppHeader from "./app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ChatbotsProvider>
      <AppHeader />
      {children}
    </ChatbotsProvider>
  );
}
