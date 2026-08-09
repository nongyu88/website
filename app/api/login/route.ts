export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const otplib = require('otplib');
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
    const { email, password, inviteToken, twoFactorCode } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 1. Find the existing user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { domain: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 2. Verify password
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch {
      isValid = user.password === password;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 3. PROCESS INVITE TOKEN FIRST (If user accepted an invite link)
    if (inviteToken) {
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken }
      });

      if (invite) {
        // Link User to Inviter's Organization and auto-approve invited teammates
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: invite.role,
            isApproved: true // Auto-approve users who were invited by an existing team member
          }
        });

        // Delete the invite token so it cannot be reused
        await prisma.invite.delete({
          where: { id: invite.id }
        });
      }
    }

    // 4. Fetch updated user state after processing any invite
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { domain: true }
    });

    // 5. STRICT APPROVAL CHECK (Evaluated against updatedUser)
    if (!updatedUser || updatedUser.isApproved === false) {
      return NextResponse.json(
        { error: "Your account is pending staff review. You will be able to log in once approved." },
        { status: 403 }
      );
    }

    // 5.5 UPDATE LAST LOGIN TIMESTAMP IN DATABASE
    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { lastLoginAt: new Date() }
    });

// 6. Check if 2FA is enabled
if (updatedUser.isTwoFactorEnabled) {
  if (!twoFactorCode || String(twoFactorCode).trim() === '') {
    return NextResponse.json({ 
      requiresTwoFactor: true, 
      email: updatedUser.email 
    }, { status: 200 });
  }

  const cleanToken = String(twoFactorCode).trim();
  const secret = updatedUser.twoFactorSecret;

  if (!secret) {
    return NextResponse.json({ error: "2FA secret is missing." }, { status: 400 });
  }

  const isValid2FA = await verifyTwoFactor(cleanToken, secret);

  if (!isValid2FA) {
    return NextResponse.json({ error: "Invalid 2FA code. Check your authenticator app." }, { status: 400 });
  }
}

    // 7. Generate session JWT token
    const token = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email },
      process.env.JWT_SECRET || 'kraftgene_super_secret_key_2026_x89z!',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Failed to authenticate." }, { status: 500 });
  }
}