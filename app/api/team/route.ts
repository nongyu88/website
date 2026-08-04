import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// FETCH ALL TEAMMATES
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.organizationId) {
      return NextResponse.json({ members: [] }); // Return empty array if no org exists yet
    }

    // Find everyone in the same organization
    const members = await prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
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

    // Remove the user from the organization (sets organizationId to null)
    await prisma.user.update({
      where: { email: targetEmail },
      data: { organizationId: null, role: "Viewer" } // Downgrade their role when kicked out
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

    // 2. Ensure the target user actually belongs to their organization
    const target = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target || target.organizationId !== requester.organizationId) {
      return NextResponse.json({ error: "User not found in your organization." }, { status: 404 });
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