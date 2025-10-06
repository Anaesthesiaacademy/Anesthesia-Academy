import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY,
    secretAccessKey: process.env.IDRIVE_SECRET,
  },
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const secure = searchParams.get("secure");
  const rangeHeader = request.headers.get("range");

  if (!key) {
    return new NextResponse("Missing key", { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (secure === "true") {
    console.log("DSADASDASD", process.env.NEXT_PUBLIC_CDN_URL, process.env.NEXT_PUBLIC_BASE_URL , !referer.startsWith(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_CDN_URL));
    
    const referer = request.headers.get("referer");
    if (!session || !referer || !referer.startsWith(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_CDN_URL)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: rangeHeader || undefined, // support partial content
    });

    const s3Response = await s3.send(command);

    const headers = new Headers();

    if (s3Response.ContentRange) {
      headers.set("Content-Range", s3Response.ContentRange);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", s3Response.ContentLength?.toString() || "0");
    } else {
      headers.set("Content-Length", s3Response.ContentLength?.toString() || "0");
    }

    headers.set("Content-Type", s3Response.ContentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(s3Response.Body, {
      status: s3Response.ContentRange ? 206 : 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy video error:", error);
    return new NextResponse("Video not found", { status: 404 });
  }
}
