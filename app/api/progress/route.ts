import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// ✅ GET /api/progress?userId=abc
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({ where: { userId } });

    if (!session) return NextResponse.json(null);

    // Parse JSON strings back into objects before returning
    return NextResponse.json({
      ...session,
      codes: JSON.parse(session.codes),
      solved: JSON.parse(session.solved),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ POST /api/progress  (upsert by userId)
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
      update: {
        stageIndex,
        bgUrl,
        minutesInput,
        timeLeft,
        codes: JSON.stringify(codes ?? {}),
        solved: JSON.stringify(solved ?? {}),
      },
      create: {
        userId,
        stageIndex,
        bgUrl,
        minutesInput,
        timeLeft,
        codes: JSON.stringify(codes ?? {}),
        solved: JSON.stringify(solved ?? {}),
      },
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT /api/progress  (partial update by userId)
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

    // Ensure codes/solved are stored as strings
    if (patch.codes) patch.codes = JSON.stringify(patch.codes);
    if (patch.solved) patch.solved = JSON.stringify(patch.solved);

    const updated = await prisma.session.update({
      where: { userId },
      data: patch,
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE /api/progress  (delete by userId)
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
