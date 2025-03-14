"use client";

import CourseCard from "./CourseCard";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OurCourses({ session }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");

        console.log(response.data);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched (or on error)
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16" id="courses">
      <div className="text-center">
        <h2 className="md:text-4xl text-3xl font-bold mb-3 text-slate-900">
          Our Specialized Courses
        </h2>
        <p className="text-slate-600 text-base">
          Master the art of anaesthesia with our comprehensive training programs
        </p>
      </div>

      {/* Show Skeleton when loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="animate-pulse space-y-4 p-4 border rounded-lg shadow">
                <div className="h-48 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {courses?.map((course) => (
            <CourseCard key={course._id} course={course} role={session?.role} />
          ))}
        </div>
      )}
    </div>
  );
}
