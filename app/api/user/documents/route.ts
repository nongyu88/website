export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch persisted documents for user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let docs = [];
    if (user.complianceDocs) {
      try {
        docs = typeof user.complianceDocs === 'string' 
          ? JSON.parse(user.complianceDocs) 
          : user.complianceDocs;
      } catch (e) {}
    }

    return NextResponse.json({ success: true, documents: docs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save document metadata to database
export async function POST(request: Request) {
  try {
    const { email, document } = await request.json();

    if (!email || !document) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let currentDocs: any[] = [];
    if (user.complianceDocs) {
      try {
        currentDocs = typeof user.complianceDocs === 'string'
          ? JSON.parse(user.complianceDocs)
          : user.complianceDocs;
      } catch (e) {}
    }

    const updatedDocs = [document, ...currentDocs];

    await prisma.user.update({
      where: { id: user.id },
      data: {
        complianceDocs: JSON.stringify(updatedDocs)
      }
    });

    return NextResponse.json({ success: true, documents: updatedDocs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove document record from database
export async function DELETE(request: Request) {
  try {
    const { email, docId } = await request.json();

    if (!email || !docId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let currentDocs: any[] = [];
    if (user.complianceDocs) {
      try {
        currentDocs = typeof user.complianceDocs === 'string'
          ? JSON.parse(user.complianceDocs)
          : user.complianceDocs;
      } catch (e) {}
    }

    const updatedDocs = currentDocs.filter((d: any) => d.id !== docId);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        complianceDocs: JSON.stringify(updatedDocs)
      }
    });

    return NextResponse.json({ success: true, documents: updatedDocs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}