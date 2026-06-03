import { NextRequest, NextResponse } from "next/server";
import { canCreateEvaSession, createEvaSessionToken, evaSessionCookieName, getEvaSessionCookieOptions, validateEvaPasscode } from "@/lib/eva-auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const passcode = String(formData.get("passcode") ?? "");
  const gatewayUrl = new URL("/eva-digital-booklet", request.url);
  const user = validateEvaPasscode(passcode);

  if (!user) {
    gatewayUrl.searchParams.set("error", "passcode");
    return NextResponse.redirect(gatewayUrl, { status: 303 });
  }

  if (!canCreateEvaSession()) {
    gatewayUrl.searchParams.set("error", "config");
    return NextResponse.redirect(gatewayUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/eva-digital-booklet/studio", request.url), { status: 303 });
  response.cookies.set(evaSessionCookieName, createEvaSessionToken(user.id), getEvaSessionCookieOptions());

  return response;
}
