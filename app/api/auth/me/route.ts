export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ valid: false, reason: "No email provided" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isApproved: true }
    });

    // If user was DELETED entirely or is set to PENDING (isApproved === false)
    if (!user || user.isApproved === false) {
      return NextResponse.json(
        { valid: false, reason: "Account inactive or deleted" }, 
        { status: 403 }
      );
    }

    // User is still active and approved
    return NextResponse.json({ valid: true }, { status: 200 });

  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}