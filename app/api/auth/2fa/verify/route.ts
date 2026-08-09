export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const otplib = require('otplib');
// Guarantee we get an object, never null
const authenticator = otplib.authenticator || otplib.default?.authenticator || otplib;

// Robust 2FA validator that handles Promises, Objects ({valid: true}), and Booleans
async function verifyTwoFactor(token: string, secret: string): Promise<boolean> {
    try {
      let res: any = null;
      if (typeof authenticator.check === 'function') {
        res = authenticator.check(token, secret);
      } else if (typeof authenticator.verify === 'function') {
        res = authenticator.verify({ token, secret });
      } else if (typeof otplib.verify === 'function') {
        res = otplib.verify({ token, secret });
      }
  
      if (res instanceof Promise) {
        res = await res;
      }
  
      if (typeof res === 'boolean') {
        return res === true;
      }
      if (res && typeof res === 'object' && 'valid' in res) {
        return res.valid === true;
      }
    } catch (err) {
      console.error("2FA verification error:", err);
    }
    return false;
  }

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: "2FA setup not initiated." }, { status: 400 });
    }

    // 1. Check if the 6-digit code matches the secret
    const isValid = await verifyTwoFactor(token, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid authenticator code. Please try again." }, { status: 400 });
    }

    // 2. Enable 2FA for the user
    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: true }
    });

    return NextResponse.json({ success: true, message: "2FA enabled successfully!" });
  } catch (error: any) {
    console.error("2FA Verify Error:", error);
    return NextResponse.json({ error: "Failed to verify 2FA code." }, { status: 500 });
  }
}