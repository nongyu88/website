export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'avatars';

    if (!connectionString) {
      return NextResponse.json({ error: "Azure Storage Connection String is missing in .env" }, { status: 500 });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Connect to Azure Blob Service
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // AUTO-CREATE CONTAINER WITH PUBLIC BLOB READ ACCESS IF MISSING
    await containerClient.createIfNotExists({
      access: 'blob' // Allows public URL reading for avatar images
    });

    // Create unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

    // Upload to Azure
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    return NextResponse.json({ url: blockBlobClient.url }, { status: 200 });

  } catch (error: any) {
    console.error("Azure Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image." }, { status: 500 });
  }
}