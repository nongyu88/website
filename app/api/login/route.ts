import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. DYNAMIC IMPORTS: This prevents the file from silently crashing on Azure startup
    const { PrismaClient } = await import("@prisma/client");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    // 2. Instantiate Prisma locally for this specific request
    const prisma = new PrismaClient();

    // 3. Safely test the database query
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbError: any) {
      return NextResponse.json({ error: `DATABASE ERROR: ${dbError.message}` }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 4. Verify hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 5. Strict approval check
    if (user.isApproved !== true) {
      return NextResponse.json(
        { error: "Account registered successfully, but is pending staff approval." },
        { status: 403 }
      );
    }

    // 6. Generate signed JWT Token using the strict hardcoded secret
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
    // If absolutely ANYTHING fails (Prisma, Azure Linux limits, missing modules), it prints here!
    return NextResponse.json({ error: `FATAL API CRASH: ${error.message}` }, { status: 500 });
  }
}