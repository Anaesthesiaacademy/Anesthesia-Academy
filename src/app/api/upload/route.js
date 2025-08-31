// /app/api/upload/route.js

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY,
    secretAccessKey: process.env.IDRIVE_SECRET,
  },
});

export async function POST(req) {
  const { fileName, fileType } = await req.json();

  if (!fileName || !fileType) {
    return new Response(JSON.stringify({ error: "Missing fileName or fileType" }), { status: 400 });
  }

  const key = `${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.IDRIVE_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 3600 * 5, // 5 hour
  });

  const publicUrl = `${process.env.IDRIVE_ENDPOINT}/${process.env.IDRIVE_BUCKET}/${key}`;

  return Response.json({
    signedUrl,
    key,
    url: publicUrl,
  });
}
