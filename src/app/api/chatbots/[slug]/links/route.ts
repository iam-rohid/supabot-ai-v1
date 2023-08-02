import type { ApiResponse } from "@/lib/types";
import { NextResponse } from "next/server";
import { withChatbot } from "../utils";
import { db } from "@/lib/drizzle";
import { LinkModel, linksTable } from "@/lib/schema/links";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const GET = withChatbot(async (req, ctx) => {
  try {
    const links = await db
      .select()
      .from(linksTable)
      .where(eq(linksTable.chatbotId, ctx.chatbot.id))
      .orderBy(desc(linksTable.lastTrainedAt), desc(linksTable.updatedAt));

    return NextResponse.json({
      success: true,
      data: links,
    } satisfies ApiResponse<LinkModel[]>);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed laod links",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});

export const POST = withChatbot(async (req, ctx) => {
  const { urls } = await req.json();
  const urlList = z.array(z.string().url()).min(1).parse(urls);

  try {
    const links = await db
      .insert(linksTable)
      .values(
        urlList.map((url) => ({
          url,
          chatbotId: ctx.chatbot.id,
        })),
      )
      .returning()
      .onConflictDoNothing();

    await Promise.all(
      links.map(async (link) =>
        fetch(
          `http://app.localhost:3000/api/chatbots/${ctx.chatbot.slug}/links/${link.id}/retrain`,
          {
            method: "POST",
          },
        ),
      ),
    );

    return NextResponse.json({
      success: true,
      data: links,
    } satisfies ApiResponse<LinkModel[]>);
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