import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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
  const version = searchParams.get("v") || Date.now(); // 👈 كسر الكاش للفيديوهات الجديدة
  const rangeHeader = request.headers.get("range");

  if (!key) return new NextResponse("Missing key", { status: 400 });

  // ✅ تحقق من referer بشكل آمن
  let refererHost = "";
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      refererHost = new URL(referer).hostname;
    } catch {
      refererHost = "";
    }
  }

  if (secure === "true") {
    const allowedHosts = [
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_CDN_URL,
    ].map(normalizeUrl);

    const isAllowed = allowedHosts.some((host) => {
      const allowedHost = new URL(host).hostname;
      return refererHost === allowedHost || refererHost.endsWith(`.${allowedHost}`);
    });

    if (!isAllowed) return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // ⚡ استخدم Range صغير لتسريع التشغيل
    let range = rangeHeader;
    if (!rangeHeader) range = "bytes=0-1048575"; // أول 1MB فقط

    const getCommand = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: range,
    });

    const s3Response = await s3.send(getCommand);

    const contentLength = s3Response.ContentLength || 1048576;
    const contentType = s3Response.ContentType || "video/mp4";

    // ✅ استخدم ContentRange لو متاح لتحديد حجم الملف الكلي
    let totalSize = contentLength;
    if (s3Response.ContentRange) {
      const match = s3Response.ContentRange.match(/\/(\d+)$/);
      if (match) totalSize = parseInt(match[1], 10);
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", contentLength.toString());
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("CDN-Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Vary", "Accept-Encoding, Range");
    headers.set("ETag", s3Response.ETag || `"${key}-${version}"`);

    if (range) {
      headers.set("Content-Range", range.replace("bytes=", "bytes ") + `/${totalSize}`);
    }

    // ✅ إعداد CORS بشكل ذكي
    const origin = request.headers.get("origin");
    const allowedHosts = [
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_CDN_URL,
    ].map(normalizeUrl);

    const matchedOrigin = allowedHosts.find((host) =>
      normalizeUrl(origin)?.startsWith(host)
    );

    if (matchedOrigin) {
      headers.set("Access-Control-Allow-Origin", matchedOrigin);
      headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Range, Accept-Encoding");
      headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
    } else if (secure !== "true") {
      headers.set("Access-Control-Allow-Origin", "*");
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return new NextResponse(s3Response.Body, { status: 206, headers });
  } catch (error) {
    console.error("Proxy video error:", error);

    if (error.name === "NoSuchKey") {
      return new NextResponse("Video not found", { status: 404 });
    }

    if (error.$metadata?.httpStatusCode === 416) {
      return new NextResponse("Range Not Satisfiable", {
        status: 416,
        headers: { "Content-Range": "bytes */*" },
      });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  const allowedHosts = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_CDN_URL,
  ].map(normalizeUrl);

  const matchedOrigin = allowedHosts.find((host) =>
    normalizeUrl(origin)?.startsWith(host)
  );

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": matchedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Accept-Encoding",
    },
  });
}
