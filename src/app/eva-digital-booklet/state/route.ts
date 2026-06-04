import { NextRequest, NextResponse } from "next/server";
import { evaSessionCookieName, getEvaSessionUser } from "@/lib/eva-auth";
import { getEvaClientPersistenceMode, getEvaStoredSnapshots, getEvaStoredState, saveEvaStoredState } from "@/lib/eva-persistence";
import type { EvaStoredStudioState } from "@/lib/eva-learning-db";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const activeUser = getEvaSessionUser(request.cookies.get(evaSessionCookieName)?.value);
  if (!activeUser) return unauthorized();

  const persistence = getEvaClientPersistenceMode();
  const state = await getEvaStoredState(activeUser.id);
  const teacherSnapshots = activeUser.canTeach ? await getEvaStoredSnapshots() : null;

  return NextResponse.json({
    persistence,
    state,
    teacherSnapshots,
  });
}

export async function POST(request: NextRequest) {
  const activeUser = getEvaSessionUser(request.cookies.get(evaSessionCookieName)?.value);
  if (!activeUser) return unauthorized();

  const body = (await request.json()) as { state?: Partial<EvaStoredStudioState> };
  try {
    const state = await saveEvaStoredState(activeUser.id, body.state ?? {});

    return NextResponse.json({ ok: true, state, persistence: getEvaClientPersistenceMode() });
  } catch {
    return NextResponse.json({ error: "persistence_not_configured" }, { status: 503 });
  }
}
