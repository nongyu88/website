import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Safely check if Azure actually loaded your database URL
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "CRITICAL: DATABASE_URL is missing in Azure Environment Variables." }, { status: 500 });
    }

    // 1. Safely test the database query
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbError: any) {
      // This forces the EXACT database error to show up in the red box on your screen!
      return NextResponse.json({ error: `DATABASE ERROR: ${dbError.message}` }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 2. Verify hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. Strict approval check
    if (user.isApproved !== true) {
      return NextResponse.json(
        { error: "Account registered successfully, but is pending staff approval." },
        { status: 403 }
      );
    }

    // 4. Generate signed JWT Token using the strict hardcoded secret
    const JWT_SECRET = "kraftgene_super_secret_key_2026_x89z!";
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
    return NextResponse.json({ error: `API CRASH: ${error.message}` }, { status: 500 });
  }
}