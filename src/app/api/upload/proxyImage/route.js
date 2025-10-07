import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
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
  const rawKey = searchParams.get("key");
  const key = decodeURIComponent(rawKey);
  const secure = searchParams.get("secure");
  const rangeHeader = request.headers.get("range");

  if (!key) {
    return new NextResponse("Missing key", { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (secure === "true") {
    const referer = request.headers.get("referer");
    if (!session || !referer || !referer.startsWith(process.env.NEXT_PUBLIC_BASE_URL)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    // Get file metadata first
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
    });
    const headResponse = await s3.send(headCommand);
    const fileSize = headResponse.ContentLength;
    const contentType = headResponse.ContentType || "video/mp4";

    // Handle range requests for video streaming
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const command = new GetObjectCommand({
        Bucket: process.env.IDRIVE_BUCKET,
        Key: key,
        Range: `bytes=${start}-${end}`,
      });

      const s3Response = await s3.send(command);

      const headers = new Headers();
      headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", chunkSize.toString());
      headers.set("Content-Type", contentType);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");

      return new NextResponse(s3Response.Body, {
        status: 206,
        headers,
      });
    } else {
      // No range request - return full file with Accept-Ranges header
      const command = new GetObjectCommand({
        Bucket: process.env.IDRIVE_BUCKET,
        Key: key,
      });

      const s3Response = await s3.send(command);

      const headers = new Headers();
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", fileSize.toString());
      headers.set("Content-Type", contentType);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");

      return new NextResponse(s3Response.Body, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error("Proxy video error:", error);
    return new NextResponse("Video not found", { status: 404 });
  }
}
