export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { email, companyName, companyWebsite, industry, region, companySize, taxId, businessLogo } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Find the user to get their associated organizationId
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, organizationId: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Update User-level fields
    await prisma.user.update({
      where: { email },
      data: {
        company: companyName,
        website: companyWebsite,
        industry,
        region,
      }
    });

    // 3. Update Organization-level fields
    if (user.organizationId) {
      await prisma.organization.update({
        where: { id: user.organizationId },
        data: {
          name: companyName || "My Organization",
          companySize,
          taxId,
          businessLogo,
        }
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Business update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}