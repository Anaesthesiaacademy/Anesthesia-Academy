import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import VideosSection from "@/src/app/components/videos/VideosSection";
import connectToDatabase from "@/src/app/lib/connectToDb";
import QueryProvider from "@/src/app/lib/QueryProvider";
import Course from "@/src/app/models/Course";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return redirect("/");
  }
  await connectToDatabase();

  const coursesData = JSON.parse(
    JSON.stringify(await Course.find({}, "title").lean())
  );

  return (
    <div>
      <div>
        <h5 className="text-2xl font-bold pl-3 mt-4">Video Details</h5>
      </div>

      <QueryProvider>
        <VideosSection courses={coursesData} />
      </QueryProvider>
    </div>
  );
}
