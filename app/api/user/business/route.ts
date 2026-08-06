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

    // 1. Find the user to get their associated domainId
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, domainId: true }
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

    // 3. Link or Create Domain, then Update Domain-level fields
    const emailDomain = email.split('@')[1]?.toLowerCase();
    let targetDomainId = user.domainId;

    if (!targetDomainId && emailDomain) {
      // Find existing domain for this company, or create one (Using findFirst avoids the ID requirement)
      let domainRecord = await prisma.domain.findFirst({ where: { name: emailDomain } });
      
      if (!domainRecord) {
        domainRecord = await prisma.domain.create({ data: { name: emailDomain } });
      }
      
      targetDomainId = domainRecord.id;

      // Link the user to this domain
      await prisma.user.update({
        where: { id: user.id },
        data: { domainId: targetDomainId }
      });
    }

    if (targetDomainId) {
      await prisma.domain.update({
        where: { id: targetDomainId },
        data: {
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