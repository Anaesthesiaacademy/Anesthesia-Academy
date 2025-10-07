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
  if (!url) return "";
  return url.replace(/\/+$/, "").replace(/^https?:\/\//, "");
}

function isAllowedHost(hostname, allowedUrls) {
  if (!hostname) return false;
  const normalizedHostname = hostname.toLowerCase();
  return allowedUrls.some((url) => {
    const allowedHost = normalizeUrl(url).toLowerCase();
    return normalizedHostname === allowedHost || normalizedHostname.endsWith(`.${allowedHost}`);
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawKey = searchParams.get("key");
  const key = decodeURIComponent(rawKey);
  const secure = searchParams.get("secure");
  const version = searchParams.get("v");
  const rangeHeader = request.headers.get("range");

  if (!key) return new NextResponse("Missing key", { status: 400 });

  const allowedUrls = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_CDN_URL,
  ].filter(Boolean);

  // ✅ تحقق من Referer أو Origin عند secure=true
  if (secure === "true") {
    const referer = request.headers.get("referer");
    const origin = request.headers.get("origin");
    let isAuthorized = false;

    if (referer) {
      try {
        const refererHost = new URL(referer).hostname;
        isAuthorized = isAllowedHost(refererHost, allowedUrls);
      } catch {}
    }

    if (!isAuthorized && origin) {
      try {
        const originHost = new URL(origin).hostname;
        isAuthorized = isAllowedHost(originHost, allowedUrls);
      } catch {}
    }

    if (!isAuthorized) {
      console.error("❌ Unauthorized access attempt:", { referer, origin, allowedUrls });
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    // ✅ إذا في Range header → استخدمه، غير كده حمّل كل الفيديو
    const getCommand = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    });

    const s3Response = await s3.send(getCommand);

    const contentType = s3Response.ContentType || "video/mp4";
    const contentLength = s3Response.ContentLength;
    const totalSize =
      s3Response.ContentRange?.match(/\/(\d+)$/)?.[1] || contentLength || 0;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("CDN-Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Vary", "Origin, Range, Accept-Encoding");
    headers.set("ETag", s3Response.ETag || `"${key}-${version}"`);

    // ✅ Content-Length و Content-Range
    if (rangeHeader) {
      const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (rangeMatch) {
        const start = rangeMatch[1];
        const end = rangeMatch[2] || totalSize - 1;
        headers.set("Content-Range", `bytes ${start}-${end}/${totalSize}`);
      }
      headers.set("Content-Length", contentLength?.toString() || "");
    } else if (contentLength) {
      headers.set("Content-Length", contentLength.toString());
    }

    // ✅ إعداد CORS
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        const originHost = new URL(origin).hostname;
        const isAllowed = isAllowedHost(originHost, allowedUrls);
        if (isAllowed) {
          headers.set("Access-Control-Allow-Origin", origin);
          headers.set("Access-Control-Allow-Credentials", "true");
        } else if (secure !== "true") {
          headers.set("Access-Control-Allow-Origin", "*");
        }
      } catch {
        if (secure !== "true") headers.set("Access-Control-Allow-Origin", "*");
      }
    } else if (secure !== "true") {
      headers.set("Access-Control-Allow-Origin", "*");
    }

    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set(
      "Access-Control-Allow-Headers",
      "Range, Accept-Encoding, Origin, Referer"
    );
    headers.set(
      "Access-Control-Expose-Headers",
      "Content-Length, Content-Range, Accept-Ranges, ETag"
    );

    return new NextResponse(s3Response.Body, {
      status: rangeHeader ? 206 : 200,
      headers,
    });
  } catch (error) {
    console.error("🚨 Proxy video error:", error);

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
  const allowedUrls = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_CDN_URL,
  ].filter(Boolean);

  const headers = new Headers();

  if (origin) {
    try {
      const originHost = new URL(origin).hostname;
      const isAllowed = isAllowedHost(originHost, allowedUrls);
      if (isAllowed) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Credentials", "true");
      } else {
        headers.set("Access-Control-Allow-Origin", "*");
      }
    } catch {
      headers.set("Access-Control-Allow-Origin", "*");
    }
  } else {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Range, Accept-Encoding, Origin, Referer"
  );
  headers.set("Access-Control-Max-Age", "86400");

  return new NextResponse(null, { status: 204, headers });
}
