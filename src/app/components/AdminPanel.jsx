"use client";

import React, { useState } from "react";
import { removeCourses, updateCourses } from "../actions/pageActions";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);

  const updateTheCourses = async () => {
    try {
      setLoading(true);

      const response = await updateCourses();

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const removeTheCourses = async () => {
    try {
      setLoading(true);

      const response = await removeCourses();

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
  
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={updateTheCourses}
        disabled={loading}
        className={`bg-[#2196f3] flex-1 inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Update The Courses
      </button>
      <button
        disabled={loading}
        onClick={removeTheCourses}
        className={`bg-[#2196f3] flex-1 inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : ""}`}      >
        Delete The Courses
      </button>
    </div>
  );
}
