// app/api/progress/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/progress?userId=abc
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const session = await prisma.session.findUnique({ where: { userId } });
  return NextResponse.json(session ?? null);
}

// POST /api/progress  (upsert by userId)`
export async function POST(req: Request) {
  const body = await req.json();
  const { userId, stageIndex, bgUrl, minutesInput, timeLeft, codes, solved } =
    body || {};

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const saved = await prisma.session.upsert({
    where: { userId },
    update: { stageIndex, bgUrl, minutesInput, timeLeft, codes, solved },
    create: {
      userId,
      stageIndex,
      bgUrl,
      minutesInput,
      timeLeft,
      codes,
      solved,
    },
  });

  return NextResponse.json(saved, { status: 201 });
}

// PUT /api/progress  (partial update by userId)
export async function PUT(req: Request) {
  const body = await req.json();
  const { userId, ...patch } = body || {};
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  const updated = await prisma.session.update({
    where: { userId },
    data: patch,
  });
  return NextResponse.json(updated);
}

// DELETE /api/progress  (delete by userId)
export async function DELETE(req: Request) {
  const body = await req.json();
  const { userId } = body || {};
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  await prisma.session.delete({ where: { userId } });
  return NextResponse.json({ message: "Deleted" });
}
