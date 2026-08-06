export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// FETCH ALL TEAMMATES
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain) {
      return NextResponse.json({ members: [] }); 
    }

    // Find everyone who shares the exact same email domain
    const members = await prisma.user.findMany({
      where: { email: { endsWith: `@${domain}` } },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, activePlans: true }
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Team Error:", error);
    return NextResponse.json({ error: "Failed to fetch team members." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { requesterEmail, targetEmail } = await req.json();

    // Verify requester has permission (Admin or Owner)
    const requester = await prisma.user.findUnique({ where: { email: requesterEmail } });
    if (!requester || (requester.role !== "Owner" && requester.role !== "Admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Downgrade their role and wipe their synced enterprise plans
    await prisma.user.update({
      where: { email: targetEmail },
      data: { role: "Viewer", activePlans: "[]" } 
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE A TEAMMATE'S ROLE
export async function PUT(request: Request) {
  try {
    const { requesterEmail, targetUserId, newRole } = await request.json();

    // 1. Verify the person making the request is an Owner or Admin
    const requester = await prisma.user.findUnique({ where: { email: requesterEmail } });
    if (!requester || (requester.role !== "Owner" && requester.role !== "Admin")) {
      return NextResponse.json({ error: "You do not have permission to modify roles." }, { status: 403 });
    }

    // 2. Ensure the target user shares the exact same email domain
    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    const requesterDomain = requesterEmail.split('@')[1]?.toLowerCase();
    const targetDomain = target?.email.split('@')[1]?.toLowerCase();

    if (!target || requesterDomain !== targetDomain) {
      return NextResponse.json({ error: "User not found in your domain." }, { status: 404 });
    }

    // 3. Update the role
    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Update Role Error:", error);
    return NextResponse.json({ error: "Failed to update role." }, { status: 500 });
  }
}