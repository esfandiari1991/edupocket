import { NextRequest, NextResponse } from "next/server";
import { evaSessionCookieName, getEvaSessionUser } from "@/lib/eva-auth";
import { getEvaStoredSnapshots, getEvaStoredState, isEvaPersistenceConfigured, saveEvaStoredState } from "@/lib/eva-persistence";
import { normalizeStoredState, type EvaStoredStudioState } from "@/lib/eva-learning-db";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const activeUser = getEvaSessionUser(request.cookies.get(evaSessionCookieName)?.value);
  if (!activeUser) return unauthorized();

  const persistence = isEvaPersistenceConfigured() ? "database" : "development";
  const state = persistence === "database" ? await getEvaStoredState(activeUser.id) : normalizeStoredState(null);
  const teacherSnapshots = persistence === "database" && activeUser.canTeach ? await getEvaStoredSnapshots() : null;

  return NextResponse.json({
    persistence,
    state,
    teacherSnapshots,
  });
}

export async function POST(request: NextRequest) {
  const activeUser = getEvaSessionUser(request.cookies.get(evaSessionCookieName)?.value);
  if (!activeUser) return unauthorized();

  if (!isEvaPersistenceConfigured()) {
    return NextResponse.json({ error: "persistence_not_configured" }, { status: 503 });
  }

  const body = (await request.json()) as { state?: Partial<EvaStoredStudioState> };
  const state = await saveEvaStoredState(activeUser.id, body.state ?? {});

  return NextResponse.json({ ok: true, state });
}
