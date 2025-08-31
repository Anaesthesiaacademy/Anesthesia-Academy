import CourseCardAdmin from "./CourseCardAdmin";
import AddCourse from "./AddCourse";

export default function CoursesSection({ courses }) {

    return (
        <div className="mt-10 shadow-lg p-8">
            <AddCourse />

            <h4 className="text-xl mb-2 font-semibold text-gray-800">
                Our Courses
            </h4>
            {courses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
                    {courses.map((course, i) => (
                        <CourseCardAdmin
                            key={i}
                            course={course}
                        />
                    ))}
                </div>
            ) : (
                <p>No courses found</p>
            )}
        </div>
    )
}
