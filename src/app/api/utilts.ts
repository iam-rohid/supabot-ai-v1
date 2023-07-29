import { authOptions } from "@/lib/auth";
import type { ApiResponse } from "@/lib/types";
import { type Session, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export interface BaseRequestHandler<C, P> {
  (req: NextRequest, ctx: C, props: P): any;
}

export type WithAuthContext = {
  params: {};
};
export type WithAuthHandlerProps = { session: Session };
export type WithAuthProps = {};

export const withAuth =
  <C extends WithAuthContext>(
    handler: BaseRequestHandler<C, WithAuthHandlerProps>,
    extraProps: WithAuthProps = {},
  ) =>
  async (req: NextRequest, ctx: C) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      } satisfies ApiResponse);
    }
    return handler(req, ctx, { session });
  };
