import { NextRequest, NextResponse } from "next/server";
import { evaSessionCookieName } from "@/lib/eva-auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/eva-digital-booklet", request.url), { status: 303 });
  response.cookies.delete(evaSessionCookieName);

  return response;
}

