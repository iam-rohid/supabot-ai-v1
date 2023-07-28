import { withAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/lib/types";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { Chatbot } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (_: NextRequest, { session }) => {
  try {
    const data = await prisma.chatbot.findMany({
      where: {
        users: {
          some: {
            userId: session.user.id,
          },
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data,
    } satisfies ApiResponse<Chatbot[]>);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to load chatbots",
    } satisfies ApiResponse<Chatbot[]>);
  }
});

export const POST = withAuth(async (req: NextRequest, { session }) => {
  const body = await req.json();

  let data: CreateChatbotSchemaData;
  try {
    data = await createChatbotSchema.parseAsync(body);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }

  try {
    const chatbot = await prisma.chatbot.create({
      data: {
        ...data,
        users: {
          create: {
            role: "OWNER",
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chatbot created",
      data: chatbot,
    } satisfies ApiResponse<Chatbot>);
  } catch (error: any) {
    console.error("Failed to create chatbot: ", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Chatbot slug is already in use.",
        } satisfies ApiResponse,
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create chatbot",
      } satisfies ApiResponse,
      { status: 400 },
    );
  }
});
