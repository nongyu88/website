import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Find user in database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 2. Verify password FIRST
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. Strict check: Must explicitly be boolean true
    if (user.isApproved !== true) {
      return NextResponse.json(
        { error: "Account registered successfully, but is pending staff approval." },
        { status: 403 }
      );
    }

    // 4. Generate JWT Token
    const JWT_SECRET = process.env.JWT_SECRET || "kraftgene_super_secret_key_2026_x89z!";
    const token = jwt.sign(
      { userId: user.id, email: user.email, company: user.company },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, company: user.company },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ 
      error: error?.message || "Internal server error during authentication." 
    }, { status: 500 });
  }
}