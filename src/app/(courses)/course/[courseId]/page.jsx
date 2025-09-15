import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/src/app/lib/connectToDb";
import { User } from "@/src/app/models/User";
import { getServerSession } from "next-auth";
import { fetchVideosByIdUser } from "@/src/app/actions/pageActions";
import { use } from "react";
import Image from "next/image";
import FormWrapper from "@/src/app/components/passwordComponents/FormWrapper";
import ShowCourse from "@/src/app/components/courseComponents/ShowCourse";
import SignInBtn from "@/src/app/components/ui/SignInBtn";
import BuyCourseBtn from "@/src/app/components/ui/BuyCourseBtn";

export default function Course({ params }) {
  const {
    data,
    success,
    message,
    courseId,
    session,
    userData,
    hasPurchased,
    courseData,
  } = use(loadCourseData(params));
  console.log("course data", session);

  if (!session) {
    return (
      <main className="bg-[#468cda]">
        <div className="flex justify-center items-center min-h-screen">
          <FormWrapper title="You must be signed in to view this course">
            <div className="w-full">
              <div className="flex justify-center items-center mt-3">
                <SignInBtn />
              </div>
            </div>
          </FormWrapper>
        </div>
      </main>
    );
  }

  if (!success && hasPurchased === false) {
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
                    courseData?.thumbnail
                      ? `/api/upload/proxyImage?key=${encodeURIComponent(
                          courseData?.thumbnail?.cloudId
                        )}`
                      : "/course.jpg"
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
                  <BuyCourseBtn
                    userData={userData}
                    courseData={courseData}
                    id={courseId}
                    userSession={session?.user}
                    courseId={courseId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!success) {
    return <div className="text-red-600">{message}</div>;
  }

  return <ShowCourse videos={data} session={session} />;
}

async function loadCourseData(params) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  console.log("session", session);
  if (!session) {
    return {};
  }
  const user = await User.findById(session.user.id, "userData").lean();

  const userData = JSON.parse(JSON.stringify(user));

  const videoResult = await fetchVideosByIdUser({
    courseId,
    userId: session?.user?.id,
  });

  console.log("🤬🤬🤬", videoResult);

  return {
    ...videoResult,
    session,
    userData,
    courseId: courseId,
    videos: videoResult.data,
  };
}
