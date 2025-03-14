"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FormWrapper from "../passwordComponents/FormWrapper";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import VideoPlayer from "../videoPlayer/VideoPlayer";

export default function ShowCourse({ id, userSession, userData }) {
  const [response, setResponse] = useState();
  const [video, setVideo] = useState({});
  const [courseData, setCourseData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ⬅️ Added loading state

  const router = useRouter();

  const buyCourse = async () => {

    if(!userData){
      router.push("/dashboard/settings");
      return;
    }

    try {
      const response = await axios.post("/api/orders", {
        amount: courseData.price,
        courseId: id,
        userData: { ...userData, email: userSession?.email },
        userId: userSession?.id,
      });
      toast.success(response.data.message);
      window.open(response.data.data);
      // return response;
    } catch (error) {
      console.log(error);
      if (error.response) {
        // If the error has a response, check the status code
        if (error.response.status === 403) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.status, error.response.data);
        }
      } else {
        toast.error("Network error or request failed:", error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true); // ⬅️ Show loading before fetching

        const response = await axios.get(`/api/courses/${id}/videos`, {
          headers: { userId: userSession?.id },
        });

        if (response.status === 200) {
          setVideo(response.data.data[0]);
          setResponse(response);
        }
      } catch (error) {
        if (error.response?.status === 403) {
          toast.error(error.response.data.message);
          setResponse(error.response);
          setCourseData(error.response.data.courseData);
        } else {
          toast.error("Network error or request failed.");
        }
      } finally {
        setLoading(false); // ⬅️ Hide loading after fetching
      }
    };

    if (userSession) {
      fetchCourse();
    } else {
      toast.error("You must be signed in to view this course.");
    }
  }, []);


  // ⬇️ Render Content After Loading
  if (!userSession) {
    return (
      <main className="bg-[#468cda]">
        <div className="flex justify-center items-center min-h-screen">
          <FormWrapper title="You must be signed in to view this course">
            <div className="w-full">
              <div className="flex justify-center items-center mt-3">
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="border px-3 w-full py-2 rounded-lg hover:-translate-y-2 transition-all text-white bg-[#2196f3] hover:bg-blue-600"
                >
                  Sign In
                </button>
              </div>
            </div>
          </FormWrapper>
        </div>
      </main>
    );
  }

    // ⬇️ Show Loading Skeleton While Fetching Data
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-4/5">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-gray-300 rounded w-2/5 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-3/5 mx-auto"></div>
              <div className="h-80 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-4/5 mx-auto"></div>
            </div>
          </div>
        </div>
      );
    }
  

  if (response?.data?.success === false) {
    return (
      <div className="text-white min-h-screen flex">
        <div className="ml-auto bg-gray-100 w-full text-black">
          <div className="md:w-4/5 w-5/6 max-w-[1500px] mx-auto h-full pt-5">
            <div className="mb-5">
              <p className="text-center text-green-500 md:text-xl text-lg font-bold">
                Purchase this course to access the content for 3 months.
              </p>
            </div>
            <div className="w-full flex flex-col md:flex-row mt-10 gap-6">
              <div className="rounded-xl overflow-clip max-h-fit shadow-lg w-full md:w-2/6">
                <Image
                  src={
                    courseData?.thumbnail?.includes("no_thumbnail")
                      ? "/course.jpg"
                      : courseData.thumbnail || "/course.jpg"
                  }
                  className="w-full max-h-[500px] object-cover hover:scale-110 transition-transform duration-500 ease-in-out"
                  width={400}
                  height={400}
                  alt={courseData.title || "Course"}
                />
              </div>
              <div className="flex flex-col gap-4 justify-between w-full md:w-4/6">
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold">{courseData.title}</h2>
                  <div className="flex gap-1 flex-col justify-center">
                    <span className="font-semibold md:text-xl text-lg">
                      Course Description
                    </span>
                    <p className="text-gray-600 break-words">
                      {courseData.description}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-col justify-center">
                    <span className="font-semibold md:text-xl text-lg">
                      Price
                    </span>
                    <p className="text-gray-600">{courseData.price} EGP</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={buyCourse}
                    type="button"
                    className="border w-full rounded-lg py-2 transition-all shadow-md hover:shadow-xl text-white bg-[#2196f3] hover:bg-blue-600"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen flex relative">
      <div
        className={`w-full md:w-1/5 md:fixed z-40 absolute transition-all ${
          sidebarOpen ? "top-0 left-0" : "top-0 -left-full md:left-0"
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
            Lessons: {response?.data?.data?.length}{" "}
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
          {response?.data?.data?.map((course) => (
            <div
              key={course?.id}
              className={`w-11/12 rounded-lg p-3 ${
                course?.id === video?.id ? "bg-[#a0daff]" : "bg-white"
              } cursor-pointer text-black`}
              onClick={() => setVideo(course)}
            >
              <div className="mb-2 font-semibold">{course?.snippet?.title}</div>
              <Image
                src={
                  course?.snippet?.thumbnails?.default?.url.includes(
                    "no_thumbnail"
                  ) || Object.keys(course?.snippet?.thumbnails).length === 0
                    ? "/course.jpg"
                    : course?.snippet?.thumbnails?.default?.url
                }
                alt={course?.snippet?.title}
                width={300}
                height={200}
                className="w-full rounded"
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
              {/* <div className="flex flex-col gap-3">
                <h2 className="text-lg font font-semibold">
                  {video?.snippet?.title}
                </h2>
                <p className="text-gray-600 break-words">
                  {video?.snippet?.description || "No Description"}
                </p>
              </div>
              <div className="relative w-full aspect-video mt-7 p-3 shadow-lg rounded-md bg-white">
                <iframe
                  className="w-full rounded-md h-full"
                  src={`https://www.youtube.com/embed/${video?.snippet?.resourceId?.videoId}`}
                  title="YouTube Video"
                  allowFullScreen
                ></iframe>
              </div> */}
              <VideoPlayer video={video} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}