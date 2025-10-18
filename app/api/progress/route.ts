import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET /api/progress?userId=abc
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Optional friendly fallback: show latest sessions when no userId
      const latest = await prisma.session.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: { userId: true, stageIndex: true, updatedAt: true },
      });
      return NextResponse.json({
        note: "Pass ?userId=<id> to fetch a specific session. Showing the latest 10.",
        latest,
      });
    }

    const session = await prisma.session.findUnique({ where: { userId } });
    return NextResponse.json(session ?? null);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/progress (upsert by userId)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, stageIndex, bgUrl, minutesInput, timeLeft, codes, solved } =
      body || {};

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/progress (partial update by userId)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...patch } = body || {};

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.session.update({
      where: { userId },
      data: patch,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/progress (delete by userId)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body || {};
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    await prisma.session.delete({ where: { userId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
