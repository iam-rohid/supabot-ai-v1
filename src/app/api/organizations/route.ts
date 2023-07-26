import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateOrgData, createOrgSchema } from "@/lib/validations/create-org";
import { Organization } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  const slug = req.nextUrl.searchParams.get("slug");

  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        every: {
          userId: session.user.id,
        },
      },
      ...(id && id.length > 0 ? { id } : {}),
      ...(slug && slug.length > 0 ? { slug } : {}),
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(organizations);
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  let data: CreateOrgData;
  try {
    data = await createOrgSchema.parseAsync(body);
  } catch (error) {
    console.log(error);
    throw error;
  }

  const org = await prisma.organization.create({
    data: {
      ...data,
      members: {
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

  return NextResponse.json(org);
};
