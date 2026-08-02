import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "CRITICAL: DATABASE_URL is missing in Azure Environment Variables." }, { status: 500 });
    }

    // 1. DYNAMIC IMPORTS: Load the Client and the SQL Server Adapter
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaMssql } = await import("@prisma/adapter-mssql");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");

    // 2. Instantiate the MSSQL Adapter with your connection string
    const adapter = new PrismaMssql(process.env.DATABASE_URL);
    
    // 3. Pass the adapter to PrismaClient to satisfy Prisma 7 requirements
    const prisma = new PrismaClient({ adapter });

    // 4. Safely test the database query
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbError: any) {
      return NextResponse.json({ error: `DATABASE ERROR: ${dbError.message}` }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 5. Verify hashed password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 6. Strict approval check
    if (user.isApproved !== true) {
      return NextResponse.json(
        { error: "Account registered successfully, but is pending staff approval." },
        { status: 403 }
      );
    }

    // 7. Generate signed JWT Token
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
    return NextResponse.json({ error: `FATAL API CRASH: ${error.message}` }, { status: 500 });
  }
}