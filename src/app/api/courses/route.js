import { NextResponse } from "next/server";
import Course from "../../models/Course";
import connectToDatabase from "../../lib/connectToDb";
// import Course from "@/models/Course";
// import connectToDatabase from "@/libs/connectToDb";

export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const courses = await Course.find().skip(skip).limit(limit);
    const totalCourses = await Course.countDocuments();

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}