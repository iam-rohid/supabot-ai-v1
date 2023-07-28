"use client";

import { ReactNode, useEffect } from "react";
import { useAppHeader } from "../../app-header";

export default function ChatboLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { chatbot: string; organization: string };
}) {
  const { setChatbot } = useAppHeader();
  useEffect(() => {
    setChatbot(params.chatbot);
    return () => {
      setChatbot(null);
    };
  }, [params.chatbot, setChatbot]);
  return <>{children}</>;
}
