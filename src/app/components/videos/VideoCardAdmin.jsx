"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { upload } from "../../lib/upload";
import PrimaryButton from "../ui/PrimaryButton";
import { removeVideo, updateVideo } from "../../actions/pageActions";

export default function VideoCardAdmin({ video, queryClient }) {
  const [preview, setPreview] = useState(video?.thumbnail || "/video.jpg");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      thumbnail: video?.thumbnail?.url || "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      videoId: video?._id,
      ...data,
      thumbnail: preview,
    };

    console.log("Form Data:", payload);

    const res = await updateVideo(payload);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    reset({
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
    });
  };

  const handleUpload = (ev) => {
    upload(ev, async ({ url, fileName: cloudId }) => {
      if (url) {
        setPreview((prev) => ({ ...prev, url, cloudId }));
        setValue("thumbnail", url, { shouldDirty: true });
        toast.success("Thumbnail uploaded successfully!");
      }
    });
  };

  const handleDelete = async () => {
    const res = await removeVideo(video?._id, video?.courseId);

    if (res.success) {
      queryClient.invalidateQueries(["videoById", video?.courseId]);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex justify-between gap-4 items-center p-4 bg-white shadow-lg rounded-xl space-y-4"
    >
      {/* Thumbnail */}
      <div className="relative w-24 aspect-square">
        <Image
          src={
            `/api/upload/proxyImage?key=${encodeURIComponent(
              preview?.cloudId
            )}` || preview
          }
          alt="Thumbnail"
          fill
          unoptimized
          className="object-cover rounded cursor-pointer"
          onClick={() =>
            document.getElementById(`thumb-input-${video?._id}`).click()
          }
        />
        <input
          type="file"
          id={`thumb-input-${video?._id}`}
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Title */}
      <input
        type="text"
        {...register("title", { required: "Title is required" })}
        className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        placeholder="Video Title"
      />

      {/* Description */}
      <textarea
        {...register("description")}
        className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        placeholder="Video Description"
        rows={1}
      ></textarea>

      {/* Submit Button */}
      <div className="flex flex-col justify-between items-center gap-1">
        <PrimaryButton
          disabled={!isDirty || isSubmitting}
          className={`text-blue-700 ${
            isSubmitting || !isDirty
              ? "opacity-50 cursor-not-allowed  hover:text-blue-400"
              : ""
          }`}
          type="submit"
        >
          Save
        </PrimaryButton>
        <PrimaryButton
          className=" text-red-500 hover:text-red-300"
          onClick={handleDelete}
        >
          Delete
        </PrimaryButton>
      </div>
    </form>
  );
}
