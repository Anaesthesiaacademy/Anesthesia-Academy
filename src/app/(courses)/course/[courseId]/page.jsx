import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import ShowCourse from "@/src/app/components/courseComponents/ShowCourse";
import connectToDatabase from "@/src/app/lib/connectToDb";
import { User } from "@/src/app/models/User";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Course({ params }) {
  const { courseId } = await params;

  const session = await getServerSession(authOptions);
  await connectToDatabase();

  const userData = session ? await User.findById({ _id: session.user.id }, "userData").lean() : null;

  return <ShowCourse id={courseId} userSession={session?.user} userData={userData?.userData} />;
}
