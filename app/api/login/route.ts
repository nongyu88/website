export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password, inviteToken } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 1. Find the existing user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 2. Verify password (using bcrypt or direct match)
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch {
      isValid = user.password === password;
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 3. 🚨 PROCESS INVITE TOKEN FOR EXISTING USERS
    if (inviteToken) {
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken }
      });

      if (invite) {
        // Link User B to User A's organization!
        await prisma.user.update({
          where: { id: user.id },
          data: {
            organizationId: invite.organizationId,
            role: invite.role,
          }
        });

        // Delete the invite token so it cannot be reused
        await prisma.invite.delete({
          where: { id: invite.id }
        });
      }
    }

    // 4. Fetch updated user details including the new Organization
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { organization: true }
    });

    // 5. Generate session JWT token matching Python backend secret
    const token = jwt.sign(
      { userId: user.id, email: user.email },
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