import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2. Verify the current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
    }

    // 3. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Save to database
    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("Password Update Error:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}