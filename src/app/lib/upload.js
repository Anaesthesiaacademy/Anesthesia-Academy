import toast from "react-hot-toast";

export async function uploadFile(file) {
  if (!file) {
    throw new Error("No file selected");
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!res.ok) throw new Error("Failed to get signed URL");

  const { signedUrl, url, key } = await res.json();

  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Direct upload failed");

  return { url, fileName: key, signedUrl };
}

export async function upload(ev, callbackFn) {
  const file = ev.target.files?.[0];
  if (!file) return;

  const uploadPromise = uploadFile(file).then((uploadResult) => {
    callbackFn(uploadResult);
    return uploadResult;
  });

  await toast.promise(uploadPromise, {
    loading: "Uploading...",
    success: "Uploaded!",
    error: "Upload error!",
  });
}
