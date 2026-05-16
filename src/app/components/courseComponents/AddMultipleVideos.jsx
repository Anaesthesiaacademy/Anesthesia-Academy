"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { addVideos } from "../../actions/pageActions";
import { uploadFile } from "../../lib/upload";
import PrimaryButton from "../ui/PrimaryButton";

function titleFromFileName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AddMultipleVideos({
  courses,
  queryClient,
  selectedCourse,
}) {
  const [courseId, setCourseId] = useState(selectedCourse || courses[0]?._id || "");
  const [rows, setRows] = useState([]);
  const [sharedDescription, setSharedDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailAsset, setThumbnailAsset] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  useEffect(() => {
    if (selectedCourse) {
      setCourseId(selectedCourse);
    }
  }, [selectedCourse]);

  const canSubmit = useMemo(() => {
    return (
      courseId &&
      rows.length > 0 &&
      (thumbnailFile || thumbnailAsset) &&
      rows.every((row) => row.title.trim()) &&
      !isUploading
    );
  }, [courseId, isUploading, rows, thumbnailAsset, thumbnailFile]);

  function handleVideoSelection(ev) {
    const files = Array.from(ev.target.files || []);

    setRows(
      files.map((file, index) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        file,
        title: titleFromFileName(file.name),
        description: "",
        status: "Ready",
      }))
    );
    setCompletedCount(0);
  }

  function updateRow(rowId, patch) {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId ? { ...row, ...patch } : row
      )
    );
  }

  function removeRow(rowId) {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    if (!canSubmit) {
      toast.error("Choose videos, thumbnail, course, and titles first");
      return;
    }

    setIsUploading(true);
    setCompletedCount(0);

    try {
      let thumbnail = thumbnailAsset;

      if (!thumbnail) {
        const uploadedThumbnail = await uploadFile(thumbnailFile);
        thumbnail = {
          url: uploadedThumbnail.url,
          cloudId: uploadedThumbnail.fileName,
        };
        setThumbnailAsset(thumbnail);
      }

      const uploadedVideos = [];

      for (const row of rows) {
        updateRow(row.id, { status: "Uploading" });

        const uploadedVideo = await uploadFile(row.file);
        uploadedVideos.push({
          title: row.title.trim(),
          description:
            row.description.trim() || sharedDescription.trim() || "",
          video: {
            url: uploadedVideo.url,
            cloudId: uploadedVideo.fileName,
          },
          thumbnail,
        });

        updateRow(row.id, { status: "Uploaded" });
        setCompletedCount((count) => count + 1);
      }

      const res = await addVideos({
        courseId,
        videos: uploadedVideos,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      queryClient.invalidateQueries(["videoById", courseId]);

      if (selectedCourse && selectedCourse !== courseId) {
        queryClient.invalidateQueries(["videoById", selectedCourse]);
      }

      setRows([]);
      setSharedDescription("");
      setThumbnailFile(null);
      setThumbnailAsset(null);

      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }

      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      toast.error("Bulk upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">
        Upload Multiple Videos
      </h2>

      <div>
        <label className="block font-medium mb-1">Select Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        >
          <option value="">Choose a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Videos</label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoSelection}
          disabled={isUploading}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Shared Thumbnail</label>
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            setThumbnailFile(e.target.files?.[0] || null);
            setThumbnailAsset(null);
          }}
          disabled={isUploading}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Shared Description
        </label>
        <textarea
          value={sharedDescription}
          onChange={(e) => setSharedDescription(e.target.value)}
          disabled={isUploading}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
          rows={3}
        />
      </div>

      {rows.length > 0 && (
        <div className="border border-blue-100 rounded-lg overflow-x-auto">
          <div className="min-w-[720px] grid grid-cols-[1.4fr_1.2fr_96px_80px] gap-2 bg-blue-50 px-3 py-2 text-sm font-semibold">
            <span>Title</span>
            <span>Description</span>
            <span>Status</span>
            <span></span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-blue-100">
            {rows.map((row) => (
              <div
                key={row.id}
                className="min-w-[720px] grid grid-cols-[1.4fr_1.2fr_96px_80px] gap-2 px-3 py-2 items-center"
              >
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) =>
                    updateRow(row.id, { title: e.target.value })
                  }
                  disabled={isUploading}
                  className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
                />
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) =>
                    updateRow(row.id, { description: e.target.value })
                  }
                  disabled={isUploading}
                  placeholder="Optional"
                  className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
                />
                <span className="text-sm text-gray-600">{row.status}</span>
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={isUploading}
                  className="text-red-500 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <p className="text-center text-sm text-gray-600">
          Uploaded {completedCount} of {rows.length} videos
        </p>
      )}

      <PrimaryButton
        disabled={!canSubmit}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Upload Batch
      </PrimaryButton>
    </form>
  );
}
