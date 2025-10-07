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
  // ⚠️ searchParams.get() already decodes - no need for decodeURIComponent
  const key = searchParams.get("key");
  const secure = searchParams.get("secure");
  const version = searchParams.get("v"); // For cache busting
  const rangeHeader = request.headers.get("range");

  if (!key) {
    return new NextResponse("Missing key", { 
      status: 400,
      headers: { "Cache-Control": "no-store" }
    });
  }

  // Security check
  if (secure === "true") {
    const referer = request.headers.get("referer");
    const allowedHosts = [
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_CDN_URL,
    ].map(normalizeUrl);

    const isAllowed = allowedHosts.some(host => 
      normalizeUrl(referer)?.startsWith(host)
    );

    if (!isAllowed) {
      return new NextResponse("Unauthorized", { 
        status: 401,
        headers: { "Cache-Control": "no-store" }
      });
    }
  }

  try {
    // 1. Get file metadata
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
    });
    
    const headResponse = await s3.send(headCommand);
    const fileSize = headResponse.ContentLength;
    const contentType = headResponse.ContentType || "video/mp4";

    // 2. Parse range header
    let start = 0;
    let end = fileSize - 1;
    let statusCode = 200;
    let contentLength = fileSize;

    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10) || 0;
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      statusCode = 206;
      contentLength = end - start + 1;

      // Validate range
      if (start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse("Range Not Satisfiable", {
          status: 416,
          headers: { 
            "Content-Range": `bytes */${fileSize}`,
            "Cache-Control": "no-store"
          },
        });
      }
    }

    // 3. Get file content
    const getCommand = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: rangeHeader && rangeHeader.startsWith("bytes=") ? rangeHeader : undefined,
    });

    const s3Response = await s3.send(getCommand);

    // 4. Prepare headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", contentLength.toString());
    headers.set("Accept-Ranges", "bytes");
    
    if (statusCode === 206) {
      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    }

    // Cache headers - CRITICAL for CDN
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("CDN-Cache-Control", "public, max-age=31536000");
    
    // ETag for validation
    if (headResponse.ETag) {
      headers.set("ETag", headResponse.ETag);
    } else if (version) {
      headers.set("ETag", `"${key.split('/').pop()}-${version}"`);
    }

    // Vary header - only for content negotiation headers
    // ⚠️ NEVER add "Range" to Vary - it will break CDN caching!
    headers.set("Vary", "Accept-Encoding");

    // CORS headers - simplified
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Range, Accept-Encoding");
    headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, ETag");

    return new NextResponse(s3Response.Body, { 
      status: statusCode, 
      headers 
    });

  } catch (error) {
    console.error("Proxy video error:", error);
    
    // Don't cache error responses
    const errorHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    };

    if (error.name === "NoSuchKey") {
      return new NextResponse("Video not found", { 
        status: 404,
        headers: errorHeaders
      });
    }

    if (error.$metadata?.httpStatusCode === 416) {
      return new NextResponse("Range Not Satisfiable", {
        status: 416,
        headers: { 
          ...errorHeaders,
          "Content-Range": "bytes */*" 
        },
      });
    }

    return new NextResponse("Internal Server Error", { 
      status: 500,
      headers: errorHeaders
    });
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Accept-Encoding",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    },
  });
}
