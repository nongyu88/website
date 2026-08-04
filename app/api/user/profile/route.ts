import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// FETCH FRESH USER PROFILE FROM AZURE SQL DB
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get('email');
  
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          website: true,
          industry: true,
          region: true,
          avatarUrl: true,
          notifySecurityAlerts: true,
          notifyProductUpdates: true,
          role: true,
        }
      });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
      console.error("Fetch Profile Error:", error);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
  }


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, firstName, lastName, company, website, 
      industry, region, avatarUrl, notifySecurityAlerts, notifyProductUpdates 
    } = body;

    if (!email) {
      return NextResponse.json({ error: "User email is required for updates." }, { status: 400 });
    }

    // Update the user record in the SQL database
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        firstName,
        lastName,
        company,
        website,
        industry,
        region,
        avatarUrl,
        notifySecurityAlerts,
        notifyProductUpdates
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        company: updatedUser.company,
        website: updatedUser.website,
        industry: updatedUser.industry,
        region: updatedUser.region,
        avatarUrl: updatedUser.avatarUrl,
        notifySecurityAlerts: updatedUser.notifySecurityAlerts,
        notifyProductUpdates: updatedUser.notifyProductUpdates,
        hasCompletedOnboarding: updatedUser.hasCompletedOnboarding
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}