export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.S3_REGION || 'us-east-1';

    if (!bucketName) {
      return NextResponse.json({ error: "S3_BUCKET_NAME is missing in .env" }, { status: 500 });
    }

    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY || '',
      },
    });

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Amazon S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Construct public S3 URL
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueName}`;

    return NextResponse.json({ url: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image." }, { status: 500 });
  }
}