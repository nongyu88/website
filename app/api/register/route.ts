import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, password, company } = await req.json();

    // 1. Existing logic: Check if user exists & hash password
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Existing logic: Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        company: company || "Unknown",
        isApproved: false, // Default to pending
      },
    });

    // 3. NEW LOGIC: Send the email alert to you
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // Change if using Office365, Outlook, etc.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "yu.nong@kraftgeneai.com", // Your direct email
        subject: `🚨 New Client Registration: ${company}`,
        html: `
          <h3>New Client Registration Alert</h3>
          <p>A new enterprise user has registered for the Kraftgene AI portal and is awaiting your approval.</p>
          <ul>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>Please log in to your database or admin dashboard to approve their access.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Admin alert email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send admin email:", emailError);
      // We don't return an error here so the user's registration still succeeds
    }

    // 4. Return success to the client
    return NextResponse.json({ 
      message: "Registration successful. Pending admin approval." 
    });

  } catch (error: any) {
    return NextResponse.json({ error: `API CRASH: ${error.message}` }, { status: 500 });
  }
}