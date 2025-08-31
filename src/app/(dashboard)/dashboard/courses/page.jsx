import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import CoursesSection from "@/src/app/components/courseComponents/CoursesSection";
import connectToDatabase from "@/src/app/lib/connectToDb";
import Course from "@/src/app/models/Course";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return redirect("/");
  }
  await connectToDatabase();

  const coursesData = JSON.parse(JSON.stringify(await Course.find({}, "-__v").lean()));

  return (
    <div>
      <div>
        <h5 className="text-2xl font-bold pl-3 mt-4">Courses Details</h5>
      </div>

      <CoursesSection session={session?.user} courses={coursesData} />

    </div>
  );
}
