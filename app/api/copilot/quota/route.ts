// app/api/copilot/quota/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = "kraftgene_super_secret_key_2026_x89z!";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, copilotPromptsLeft: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentPrompts = user.copilotPromptsLeft ?? 20;

    if (currentPrompts <= 0) {
        return NextResponse.json({
            allowed: false,
            remaining: 0,
            message: "⚠️ You have exceeded pre-configured msg amount, if you need more please contact customer@kraftgeneai.ca",
        });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { copilotPromptsLeft: currentPrompts - 1 },
      select: { copilotPromptsLeft: true },
    });

    return NextResponse.json({
      allowed: true,
      remaining: updatedUser.copilotPromptsLeft,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}