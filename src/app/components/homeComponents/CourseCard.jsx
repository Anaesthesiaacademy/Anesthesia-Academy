import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillClockFill } from "react-icons/bs";
import { FaBook } from "react-icons/fa";
import UpdateCoursePrice from "../../forms/UpdateCoursePrice";

export default function CourseCard({ course, role, dateDistance }) {
  console.log("course", course  );
  
  return (
    <div className="shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-clip flex flex-col">
      {
        dateDistance && (
          <p className="text-sm md:text-base text-slate-600 px-4 py-2"  >Course exp in: <span>{dateDistance} / 3 months</span></p>
        )
      }
      <div className="w-full h-[210px] overflow-clip">
        <Image
          src={
            course?.thumbnail.includes("no_thumbnail")
              ? "/course.jpg"
              : course?.thumbnail
          }
          alt={course?.title}
          width={350}
          height={200}
          className="w-full"
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div className="px-4 py-6">
          <h4 className="md:text-2xl text-xl font-semibold mb-2">
            {course?.title}
          </h4>
          <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed break-words line-clamp-3">
            {course?.description}
          </p>
        </div>
        {role === "admin" ? (
          <UpdateCoursePrice courseId={course?._id} coursePrice={course?.price} />
        ) : (
          <div>
            <div className="flex gap-4 py-5 mx-4 border-t">
              <div className="flex gap-1 items-center">
                <BsFillClockFill color="#2196f3" /> 12 Weeks
              </div>
              <div className="flex gap-1 items-center">
                {" "}
                <FaBook color="#2196f3" /> {course?.count} Lessons
              </div>
            </div>
            <div>
              <Link
                href={`/course/${course?._id}`}
                className="bg-[#2196f3] inline-block text-lg text-center transition-colors hover:bg-blue-600 text-white w-full py-3 px-4"
              >
                Start Learning
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
