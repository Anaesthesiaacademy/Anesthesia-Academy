import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY,
    secretAccessKey: process.env.IDRIVE_SECRET,
  },
});

function normalizeUrl(url) {
  return url?.replace(/\/+$/, "");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawKey = searchParams.get("key");
  const key = decodeURIComponent(rawKey);
  const secure = searchParams.get("secure");
  const version = searchParams.get("v");
  const rangeHeader = request.headers.get("range");

  if (!key) return new NextResponse("Missing key", { status: 400 });

  // Security check
  if (secure === "true") {
    const referer = request.headers.get("referer");
    const allowedHosts = [
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_CDN_URL,
    ].map(normalizeUrl);

    const isAllowed = allowedHosts.some(host => normalizeUrl(referer)?.startsWith(host));

    if (!isAllowed) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    // استخدم GetObject مباشرة بدون HeadObject
    const getCommand = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: rangeHeader,
    });

    const s3Response = await s3.send(getCommand);
    
    // خذ المعلومات من GetObject نفسه
    const fileSize = s3Response.ContentLength;
    const contentType = s3Response.ContentType || "video/mp4";
    const contentRange = s3Response.ContentRange;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", fileSize.toString());
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("CDN-Cache-Control", "public, max-age=31536000");
    headers.set("Vary", "Accept-Encoding, Range");
    headers.set("ETag", s3Response.ETag || `"${key}-${version}"`);

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    const origin = request.headers.get("origin") || request.headers.get("referer");
    const allowedHosts = [
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_CDN_URL,
    ].map(normalizeUrl);
    const matchedOrigin = allowedHosts.find(host => normalizeUrl(origin)?.startsWith(host));
    headers.set("Access-Control-Allow-Origin", matchedOrigin || "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Range, Accept-Encoding");
    headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");

    const statusCode = rangeHeader ? 206 : 200;
    return new NextResponse(s3Response.Body, { status: statusCode, headers });
    
  } catch (error) {
    console.error("Proxy video error:", error);
    if (error.name === "NoSuchKey") {
      return new NextResponse("Video not found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    },
  });
}
