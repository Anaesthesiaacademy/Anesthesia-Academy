import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY,
    secretAccessKey: process.env.IDRIVE_SECRET,
  },
});

export async function deleteFromStorage(cloudId) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.IDRIVE_BUCKET,
    Key: cloudId,
  });

  try {
    await s3.send(command);
    console.log(`Deleted: ${cloudId}`);
  } catch (err) {
    console.error("Delete failed:", err);
  }
}
