"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import { addVideo } from "../../actions/pageActions";
import { upload } from "../../lib/upload";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AddVideo({ courses, queryClient, selectedCourse }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const res = await addVideo({
      ...data,
      thumbnail: thumbnailPreview,
      video: videoPreview,
      courseId: data?.courseId,
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
      return;
    }
    queryClient.invalidateQueries(["videoById", selectedCourse]);
    reset();
    setVideoPreview(null);
    setThumbnailPreview(null);
  };

  console.log("tesssssssssssssss", !videoPreview , !thumbnailPreview , !isDirty , !isValid , isSubmitting)

  function handleUpload(ev, type) {
    upload(ev, async ({ url, fileName: cloudId }) => {
      if (url) {
        if (type === "video") {
          setVideoPreview({
            url,
            cloudId,
          });
          toast.success("Video Thumbnail uploaded successfully!");
          return;
        }

        setThumbnailPreview({
          url,
          cloudId,
        }),
          toast.success("Thumbnail uploaded successfully!");
      }
    });
  }

  console.log("Thumbnail Preview:", thumbnailPreview);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto mb-6 bg-white p-6 rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">Upload Video</h2>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Video</label>
        <input
          type="file"
          accept="video/*"
          {...register("video", { required: true })}
          onChange={(e) => handleUpload(e, "video")}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
        {videoPreview && (
          <video
            preload="metadata"
            src={`/api/upload/proxyImage?key=${encodeURIComponent(
              videoPreview?.cloudId
            )}&secure=true`}
            controls
            className="mt-2 mx-auto w-64 max-h-32"
          />
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          {...register("thumbnail", { required: true })}
          onChange={(e) => handleUpload(e, "thumbnail")}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
        {thumbnailPreview && (
          <Image
            src={`/api/upload/proxyImage?key=${encodeURIComponent(
              thumbnailPreview?.cloudId
            )}`}
            alt="Thumbnail Preview"
            width={200}
            height={200}
            quality={70}
            className="w-40 aspect-square mt-2 rounded mx-auto shadow"
          />
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Select Course</label>
        <select
          {...register("courseId", { required: true })}
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

      <PrimaryButton
        disabled={!videoPreview || !thumbnailPreview || !isDirty || !isValid || isSubmitting}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Submit Video
      </PrimaryButton>
    </form>
  );
}
