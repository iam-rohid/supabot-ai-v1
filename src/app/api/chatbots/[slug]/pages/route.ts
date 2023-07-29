import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateEmbeddingFromSections,
  htmlToMarkdown,
  splitMarkdownBySections,
} from "./utils";
import type { Page } from "@prisma/client";
import { withChatbot } from "../utils";

export const config = {
  runtime: "edge",
};

export const GET = withChatbot(async (req, ctx, { chatbot }) => {
  try {
    const pages = await prisma.page.findMany({
      where: { chatbotId: chatbot.id },
    });
    return NextResponse.json({
      success: true,
      data: pages,
    } satisfies ApiResponse<Page[]>);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed laod pages",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});

export const POST = withChatbot(async (req, ctx, { chatbot }) => {
  const { url } = await req.json();
  if (!url || typeof url !== "string" || url.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "url is required",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
  try {
    const alreadyExists = await prisma.page.findUnique({
      where: { chatbotId_url: { url, chatbotId: chatbot.id } },
      select: { id: true },
    });

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          error: "Page already exists",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }

    let html: string;

    try {
      const res = await fetch(url);
      html = await res.text();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch page",
        } satisfies ApiResponse,
        { status: 400 },
      );
    }

    const { markdown, metadata } = htmlToMarkdown(html);
    const sections = splitMarkdownBySections(markdown);
    const sectionsWithEmbedding = await generateEmbeddingFromSections(sections);

    const page = await prisma.page.create({
      data: {
        url,
        metadata,
        chatbotId: chatbot.id,
        sections: {
          createMany: {
            data: sectionsWithEmbedding,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Page fetch success!",
      data: page,
    } satisfies ApiResponse<any>);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch url",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});
