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
    const referer = request.headers.get("referer"); // ✅ Move this up

    console.log(
      "DSADASDASD",
      process.env.NEXT_PUBLIC_CDN_URL,
      process.env.NEXT_PUBLIC_BASE_URL,
      !referer?.startsWith(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_CDN_URL)
    );

    if (!session || !referer || !referer.startsWith(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_CDN_URL)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: key,
      Range: rangeHeader || undefined,
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
