import { NextResponse } from "next/server";
import axios from "axios";
import Order from "@/src/app/models/Order";
import Course from "@/src/app/models/Course";
import connectToDatabase from "@/src/app/lib/connectToDb";
import { addMonths } from "date-fns";
// import Order from "@/models/Order";
// import connectToDatabase from "@/libs/connectToDb";
// import Course from "@/models/Course";

const API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req, { params }) {
  const { id } = await params; // Playlist ID
  const userId = await req.headers.get("userId"); // Pass user ID in request headers

  await connectToDatabase();

  // Check if user has purchased the course
  const hasPurchased = await Order.findOne({ userId, courseId: id, status: "completed" });

  const currentCourse = await Course.findOne({ _id: id }, { _id: 0 });

  if (!hasPurchased) {
    return NextResponse.json(
      {
        success: false,
        message: "Access denied. Please purchase the course.",
        courseData: currentCourse,
      },
      { status: 403 }
    );
  }

  const now = Date.now();
  const expData = addMonths(hasPurchased.createdAt, +3)

  if (now >= expData) {
    await Order.updateOne({ _id: hasPurchased._id }, { status: "expired" });

    return NextResponse.json(
      {
        success: false,
        message:
          "Sorry your subscription has expired, Please purchase the course.",
        courseData: currentCourse,
      },
      { status: 403 }
    );
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${currentCourse["playlistId"]}&key=${API_KEY}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch videos from YouTube");
    }

    return NextResponse.json({
      success: true,
      data: response.data.items,
      courseData: currentCourse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
