"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updatePrice } from "../actions/pageActions";

export default function UpdateCoursePrice({ courseId, coursePrice }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      price: coursePrice,
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await updatePrice(courseId, data.price);

      
      if (response.success) {
        toast.success(response.message);
        reset(); // Reset form after success
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <label className="flex flex-col px-1 mb-1">
        <span className="text-gray-700">New Price:</span>
        <input
          type="number"
          {...register("price", { required: true })}
          className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
          placeholder="Enter new price"
        />
      </label>

      <button
        type="submit"
        className={`px-4 py-2 w-full bg-blue-600 text-white rounded ${loading && "opacity-50 cursor-not-allowed"}`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Price"}
      </button>
    </form>
  );
}
