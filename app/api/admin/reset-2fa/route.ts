import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Please provide an email in the URL (e.g., ?email=your_email@gmail.com)" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully unlocked 2FA for ${updatedUser.email}! You can now log in with just your password.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}