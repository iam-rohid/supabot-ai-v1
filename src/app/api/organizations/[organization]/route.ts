import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: { params: { organization: string } },
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await prisma.organization.findUnique({
    where: {
      slug: ctx.params.organization,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!data) {
    return new NextResponse("Organization not found", {
      status: 404,
    });
  }

  return NextResponse.json(data);
};
