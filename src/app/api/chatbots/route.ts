import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

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

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  let data: CreateChatbotSchemaData;
  try {
    data = await createChatbotSchema.parseAsync(body);
  } catch (error) {
    console.log(error);
    throw error;
  }
  console.log({ data });
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

  return NextResponse.json(chatbot);
};
