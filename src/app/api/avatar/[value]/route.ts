import { NextRequest, NextResponse } from "next/server";
import { generateSVG } from "./gradients";

export const GET = async (
  req: NextRequest,
  { params }: { params: { value: string } }
) => {
  const size = req.nextUrl.searchParams.has("size")
    ? Number(req.nextUrl.searchParams.has("size"))
    : 256;
  const svg = generateSVG(params.value, size);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
};
