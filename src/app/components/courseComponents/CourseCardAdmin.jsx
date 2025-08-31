"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { upload } from "../../lib/upload";
import toast from "react-hot-toast";
import { removeCourse, updateCourse } from "../../actions/pageActions";
import PrimaryButton from "../ui/PrimaryButton";

export default function CourseCardAdmin({ course }) {
  const [preview, setPreview] = useState(course?.thumbnail || "/course.jpg");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      price: course?.price || "",
      thumbnail: null,
    },
  });

  const onSubmit = async (data) => {
    console.log("data", { ...data, thumbnail: preview, courseId: course?._id });

    const res = await updateCourse({
      ...data,
      thumbnail: preview,
      courseId: course?._id,
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
      return;
    }
  };

  function handleUpload(ev) {
    upload(ev, async ({ url, fileName: cloudId }) => {
      if (url) {
        setPreview({
          url,
          cloudId,
        }),
          toast.success("Thumbnail uploaded successfully!");
      }
    });
  }

  const handleDelete = async () => {
    const res = await removeCourse(course?._id);

    if (res.success) {
      setPreview(null);
      toast.success(res.message);
    } else {
      toast.error(res.message);
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-clip flex flex-col"
    >
      <div className="w-full h-[210px] overflow-hidden">
        <Image
          src={`/api/upload/proxyImage?key=${encodeURIComponent(preview?.cloudId || course?.thumbnail?.cloudId)}` || preview}
          alt="Course Thumbnail"
          width={350}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col h-full justify-between px-4 py-6 gap-4">
        {/* Title */}
        <input
          type="text"
          {...register("title", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
          placeholder="Course Title"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">Title is required</span>
        )}

        {/* Description */}
        <textarea
          {...register("description", { required: true })}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
          placeholder="Course Description"
          rows={3}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">Description is required</span>
        )}

        {/* Thumbnail Upload */}
        <label className="flex flex-col px-1 mb-1">
          <span className="text-gray-700">change Thumbnail:</span>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleUpload(e)}
            className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
          />
        </label>

        {/* Price */}

        <label className="flex flex-col px-1 mb-1">
          <span className="text-gray-700">Price:</span>
          <input
            type="number"
            {...register("price", { required: true })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            placeholder="Enter new price"
          />
        </label>

        {/* Submit */}
        <div className="flex justify-between items-center gap-4 mt-4">
          <PrimaryButton
            disabled={!isDirty || isSubmitting}
            className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${
              isSubmitting || (!isDirty && "opacity-50 cursor-not-allowed")
            }`}
            type="submit"
          >
            Submit Course
          </PrimaryButton>
          <PrimaryButton
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete Course
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
