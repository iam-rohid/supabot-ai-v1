import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import {
  generateEmbeddingFromSections,
  htmlToMarkdown,
  splitMarkdownBySections,
} from "./utils";
import { withChatbot } from "../utils";
import { db } from "@/lib/drizzle";
import { Page, pagesTable } from "@/lib/schema/pages";
import { and, eq } from "drizzle-orm";
import { pageSectionsTable } from "@/lib/schema/page_sections";

export const config = {
  runtime: "edge",
};

export const GET = withChatbot(async (req, ctx) => {
  try {
    const pages = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.chatbotId, ctx.chatbot.id));
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

export const POST = withChatbot(async (req, ctx) => {
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
    const alreadyExists = await db
      .select({ id: pagesTable.id })
      .from(pagesTable)
      .where(
        and(eq(pagesTable.chatbotId, ctx.chatbot.id), eq(pagesTable.url, url)),
      );

    if (alreadyExists.length) {
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
    const [page] = await db
      .insert(pagesTable)
      .values({
        url,
        chatbotId: ctx.chatbot.id,
        trainingStatus: "training",
        metadata,
      })
      .returning({ id: pagesTable.id });

    try {
      const sections = splitMarkdownBySections(markdown);
      console.log("SECTIONS ARE SEPERATED");
      const sectionsWithEmbedding = await generateEmbeddingFromSections(
        sections,
      );
      console.log("SECTION EMBEDDINGS ARE GENERATED");
      console.log(JSON.stringify(sectionsWithEmbedding, null, 2))
      await Promise.all(
        sectionsWithEmbedding.map((section) =>
          db.insert(pageSectionsTable).values({
            pageId: page.id,
            content: section.content,
            embedding: section.embedding,
            tokenCount: section.tokenCount,
            metadata: {
              ...section.metadata,
            },
          }),
        ),
      );
      console.log("SECTIONS ARE PUSHED TO DATABASE");

      const [updatedPage] = await db
        .update(pagesTable)
        .set({
          trainingStatus: "trained",
          lastTrainedAt: new Date(Date.now()),
        })
        .where(eq(pagesTable.id, page.id))
        .returning();

      console.log("UPDATED PAGE STATUS");

      return NextResponse.json({
        success: true,
        message: "Page training success!",
        data: updatedPage,
      } satisfies ApiResponse<Page>);
    } catch (error) {
      console.log("FAILED", error);
      const [updatedPage] = await db
        .update(pagesTable)
        .set({
          trainingStatus: "failed",
          lastTrainedAt: new Date(Date.now()),
        })
        .where(eq(pagesTable.id, page.id))
        .returning();
      return NextResponse.json({
        success: true,
        message: "Page training failed!",
        data: updatedPage,
      } satisfies ApiResponse<Page>);
    }
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
