"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AddUrlForm() {
  const { chatbot: botSlug } = useParams() as { chatbot: string };
  const [pageUrl, setPageUrl] = useState("");

  const handleSubmit = async () => {
    const res = await fetch(`/api/chatbots/${botSlug}/pages`, {
      method: "POST",
      body: JSON.stringify({ url: pageUrl }),
    });
    const data = await res.json();
    console.log({ data });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
        value={pageUrl}
        onChange={(e) => setPageUrl(e.currentTarget.value)}
        placeholder="Add page url"
      />
      <Button type="submit">Add Page</Button>
    </form>
  );
}
