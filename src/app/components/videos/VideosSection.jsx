"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVideosById } from "../../actions/pageActions";
import VideoCardAdmin from "./VideoCardAdmin";
import AddVideo from "../courseComponents/AddVideo";
import { useState } from "react";

export default function VideosSection({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?._id);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["videoById", selectedCourse],
    queryFn: async () => {
      const data = await getVideosById(selectedCourse);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch video by id");
      }
      console.log("res", data);

      return data?.data;
    },
    enabled: !!selectedCourse,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="mt-10 shadow-lg p-8">
      <AddVideo
        courses={courses}
        queryClient={queryClient}
        selectedCourse={selectedCourse}
      />

      <div className="w-full p-4 flex flex-col gap-2">
        <p className="text-2xl font-bold">Select Course</p>

        <select
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
        >
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      <h5 className="text-2xl font-bold pl-3 mb-4">Videos</h5>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error fetching videos</p>
      ) : (
        <div className="grid grid-cols-1 max-h-[500px] overflow-y-auto gap-4">
          {data?.length > 0 ? (
            data?.map((video) => (
              <VideoCardAdmin
                video={video}
                key={video._id}
                queryClient={queryClient}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No videos found</p>
          )}
        </div>
      )}
    </div>
  );
}