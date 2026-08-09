export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

// Safely resolve otplib across all Next.js bundler formats
const otplib = require('otplib');
const authenticator = 
  otplib.authenticator || 
  otplib.default?.authenticator || 
  (typeof otplib.generateSecret === 'function' ? otplib : null) ||
  (typeof otplib.default?.generateSecret === 'function' ? otplib.default : null);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Generate a new secret key
    const secret = authenticator.generateSecret();

    // 2. Save secret to user in database
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret }
    });

    // 3. Create a scannable otpauth URL manually (Bypasses the otplib keyuri compilation error)
    const issuer = 'Kraftgene AI';
    const otpauth = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(user.email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

    // 4. Convert URI into a QR Code image base64 string
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    return NextResponse.json({ qrCodeUrl, secret });
  } catch (error: any) {
    console.error("2FA Setup Error:", error);
    return NextResponse.json({ error: "Failed to generate 2FA QR code." }, { status: 500 });
  }
}