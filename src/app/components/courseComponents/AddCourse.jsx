"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { upload } from "../../lib/upload";
import Image from "next/image";
import PrimaryButton from "../ui/PrimaryButton";
import { addCourses } from "../../actions/pageActions";

export default function AddCourse() {
  const { register, handleSubmit, reset } = useForm();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const onSubmit = async (data) => {
    if (!thumbnailPreview) {
      toast.error("Please upload a thumbnail.");
      return;
    }

    console.log("data", { ...data, thumbnail: thumbnailPreview });

    const res = await addCourses({ ...data, thumbnail: thumbnailPreview });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
      return;
    }

    reset();
    setThumbnailPreview(null);
  };

  function handleUpload(ev) {
    upload(ev, async ({ url, fileName: cloudId }) => {

      if (url) {
        setThumbnailPreview({
          url,
          cloudId,
        }),
          toast.success("Thumbnail uploaded successfully!");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mb-6 mx-auto p-4 bg-white shadow-lg rounded-xl space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center">Add New Course</h2>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register("description", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
          rows="4"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          {...register("thumbnail")}
          onChange={(e) => handleUpload(e)}
          className="mt-1"
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
            className="w-40 aspect-square mt-2 rounded shadow"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Price ($)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        />
      </div>

      <PrimaryButton
        disabled={!thumbnailPreview}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        type="submit"
      >
        Submit Course
      </PrimaryButton>
    </form>
  );
}
