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
  const version = searchParams.get("v"); // For cache busting
  const rangeHeader = request.headers.get("range");

  if (!key) return new NextResponse("Missing key", { status: 400 });

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

    console.log("Referer Check =>", {
      referer,
      allowedHosts,
      isAllowed,
    });

    if (!isAllowed) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    // Get file metadata first to know the total size
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
    });

    const headResponse = await s3.send(headCommand);
    const fileSize = headResponse.ContentLength;
    const contentType = headResponse.ContentType || "video/mp4";

    let start = 0;
    let end = fileSize - 1;
    let statusCode = 200;

    // Parse range header if present
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      statusCode = 206; // Partial Content

      // Validate range
      if (start >= fileSize || end >= fileSize) {
        return new NextResponse("Range Not Satisfiable", {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }
    }

    const chunkSize = end - start + 1;

    // Get the actual file content with range
    const getCommand = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: rangeHeader || undefined,
    });

    const s3Response = await s3.send(getCommand);

    // Prepare response headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", chunkSize.toString());
    headers.set("Accept-Ranges", "bytes");
    
    if (rangeHeader) {
      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    }

    // Cache headers - CRITICAL for Cloudflare
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("ETag", headResponse.ETag || `"${key}-${version}"`);
    headers.set("Vary", "Accept-Encoding, Range"); // Important for Range caching
    
    // CORS headers
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Range, Accept-Encoding");
    headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");

    return new NextResponse(s3Response.Body, {
      status: statusCode,
      headers,
    });

  } catch (error) {
    console.error("Proxy video error:", error);
    
    if (error.name === "NoSuchKey") {
      // ⭐ CRITICAL: Don't cache 404 responses
      return new NextResponse("Video not found", { 
        status: 404,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        }
      });
    }
    
    // Don't cache errors
    return new NextResponse("Internal Server Error", { 
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    },
  });
}
