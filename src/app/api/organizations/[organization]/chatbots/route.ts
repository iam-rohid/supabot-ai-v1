import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CreateChatbotSchemaData,
  createChatbotSchema,
} from "@/lib/validations";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { organization: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await prisma.chatbot.findMany({
    where: {
      organization: {
        slug: ctx.params.organization,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(data);
};

export const POST = async (
  req: NextRequest,
  ctx: { params: { organization: string } },
) => {
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

  const organization = await prisma.organization.findUnique({
    where: {
      slug: ctx.params.organization,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!organization) {
    throw new NextResponse("Organization not found!", { status: 401 });
  }

  const chatbot = await prisma.chatbot.create({
    data: {
      ...data,
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
  });

  return NextResponse.json(chatbot);
};
