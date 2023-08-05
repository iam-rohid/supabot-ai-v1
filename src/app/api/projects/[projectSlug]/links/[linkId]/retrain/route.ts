import { NextResponse } from "next/server";
import { withLink } from "../utils";
import { ApiResponse } from "@/lib/types";
import { db } from "@/lib/db";
import { linksTable } from "@/lib/schema/links";
import { eq } from "drizzle-orm";
import {
  generateEmbeddingFromSections,
  htmlToMarkdown,
  splitMarkdownBySections,
} from "./utils";
import { embeddingsTable } from "@/lib/schema/embeddings";
import type { LinkModel } from "@/lib/types/db-types";

export const POST = withLink(async (req, ctx) => {
  if (ctx.link.trainingStatus === "training") {
    return NextResponse.json({
      success: false,
      error: "Link is already in training",
    } satisfies ApiResponse);
  }

  await db
    .update(linksTable)
    .set({
      trainingStatus: "training",
      updatedAt: new Date(),
    })
    .where(eq(linksTable.id, ctx.link.id));

  await db
    .delete(embeddingsTable)
    .where(eq(embeddingsTable.linkId, ctx.link.id));

  let html: string;
  try {
    const res = await fetch(ctx.link.url);
    html = await res.text();
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch link",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }

  const { markdown, metadata } = htmlToMarkdown(html);
  try {
    const sections = splitMarkdownBySections(markdown);
    console.log("SECTIONS ARE SEPERATED");
    const sectionsWithEmbedding = await generateEmbeddingFromSections(sections);
    console.log("SECTION EMBEDDINGS ARE GENERATED");
    await Promise.all(
      sectionsWithEmbedding.map((section) =>
        db.insert(embeddingsTable).values({
          linkId: ctx.link.id,
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
    const [updatedLink] = await db
      .update(linksTable)
      .set({
        metadata,
        trainingStatus: "trained",
        lastTrainedAt: new Date(Date.now()),
        updatedAt: new Date(),
      })
      .where(eq(linksTable.id, ctx.link.id))
      .returning();
    console.log("UPDATED PAGE STATUS");
    return NextResponse.json({
      success: true,
      message: "Link training success!",
      data: updatedLink,
    } satisfies ApiResponse<LinkModel>);
  } catch (error) {
    console.log("FAILED", error);
    const [updatedLink] = await db
      .update(linksTable)
      .set({
        trainingStatus: "failed",
        lastTrainedAt: new Date(Date.now()),
        updatedAt: new Date(),
      })
      .where(eq(linksTable.id, ctx.link.id))
      .returning();
    return NextResponse.json({
      success: true,
      message: "Link training failed!",
      data: updatedLink,
    } satisfies ApiResponse<LinkModel>);
  }
});
