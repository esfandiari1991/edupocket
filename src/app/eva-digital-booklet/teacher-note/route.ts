import { NextRequest, NextResponse } from "next/server";
import { evaSessionCookieName, getEvaSessionUser } from "@/lib/eva-auth";
import { saveEvaTeacherNote } from "@/lib/eva-persistence";
import type { EvaUserId } from "@/lib/eva-learning-db";

export const dynamic = "force-dynamic";

const learnerIds = new Set(["ali", "eva", "elham"]);

export async function POST(request: NextRequest) {
  const activeUser = getEvaSessionUser(request.cookies.get(evaSessionCookieName)?.value);
  if (!activeUser || !activeUser.canTeach) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { learnerUserId?: string; pageId?: string; note?: string };
  if (!body.learnerUserId || !learnerIds.has(body.learnerUserId) || !body.pageId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    await saveEvaTeacherNote(activeUser.id, body.learnerUserId as EvaUserId, body.pageId, body.note ?? "");
  } catch {
    return NextResponse.json({ error: "persistence_not_configured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
