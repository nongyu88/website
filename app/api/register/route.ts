import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, company } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new user to Azure SQL
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: company || "",
      },
    });

    return NextResponse.json({ 
      message: "Account registered successfully", 
      userId: user.id 
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}