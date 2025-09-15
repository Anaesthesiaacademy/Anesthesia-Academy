"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ShowCourse({ videos, session }) {
  const [video, setVideo] = useState(videos?.[0] || {});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log("video", video);

  const router = useRouter();

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
    }

    const handleKeyDown = (e) => {

      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Ctrl + Shift + I (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault()
        return false
      }

      // Ctrl + S (Save Page)
      if (e.ctrlKey && e.key === 'S') {
        e.preventDefault()
        return false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('contextmenu', handleContextMenu)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('contextmenu', handleContextMenu)
    }

  }, [])


  return (
    <div className="text-white min-h-screen flex relative">
      <div
        className={`w-full md:w-1/5 md:fixed z-40 absolute transition-all ${sidebarOpen ? "top-0 left-0" : "top-0 -left-full md:left-0"
          } h-screen overflow-y-auto bg-[#2196f3] py-4`}
      >
        <div className="flex items-center text-bold">
          <div className="w-fit p-2 z-50">
            <FaArrowLeft
              onClick={() => router.back()}
              size={25}
              className="cursor-pointer text-white"
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <p className="text-center text-sm md:text-lg text-nowrap font-bold md:block flex justify-between items-center px-4">
              Lessons: {videos?.length}{" "}
            </p>
            <div className="px-4 cursor-pointer">
              <IoClose
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4 items-center">
          {videos?.map((course) => (
            <div
              key={course?._id}
              className={`w-11/12 rounded-lg p-3 ${course?._id === video?._id ? "bg-[#a0daff]" : "bg-white"
                } cursor-pointer text-black`}
              onClick={() => setVideo(course)}
            >
              <div className="mb-2 font-semibold">{course?.title}</div>
              <Image
                src={
                  course?.thumbnail?.cloudId
                    ? `/api/upload/proxyImage?key=${encodeURIComponent(course?.thumbnail?.cloudId)}`
                    : "/course.jpg"
                }
                alt={course?.title}
                width={300}
                height={200}
                className="w-full max-h-52 object-cover bg-top rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ml-auto bg-gray-100 md:w-4/5 w-full text-black">

        <div className="w-fit p-2 z-50 block md:hidden">
          <FaArrowLeft
            onClick={() => router.back()}
            size={25}
            className="cursor-pointer text-black"
          />
        </div>

        <div className="md:w-4/5 w-5/6 max-w-[1500px] mx-auto h-full pt-5">
          <div className="mb-5 block md:hidden">
            <button type="button">
              <IoMenu
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              />
            </button>
          </div>

          {Object.keys(video).length ? (
            <>
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font font-semibold">
                  {video?.title}
                </h2>
                <p className="text-gray-600 break-words">
                  {video?.description || "No Description"}
                </p>
              </div>
              <div className="relative w-full aspect-video mt-7 p-3 shadow-lg rounded-md bg-white">
                <video
                  preload="metadata"
                  className="w-full rounded-md h-full"
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload" // Hides the download button
                  src={`/api/upload/proxyImage?key=${encodeURIComponent(video?.video?.cloudId)}&secure=true`}
                  title="YouTube Video"
                  allowFullScreen
                  controls
                  poster={
                    video?.thumbnail?.url
                      ? `/api/upload/proxyImage?key=${encodeURIComponent(video?.thumbnail?.cloudId)}`
                      : "/course.jpg"
                  }
                ></video>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}